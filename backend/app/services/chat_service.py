import json
import re
import googlemaps
from sqlmodel.ext.asyncio.session import AsyncSession
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import get_settings
from app.schemas.lead import LeadCreate
from app.models.lead import Lead
from app.models.users import User  # assuming you have a User model

# -----------------------
# Settings & Globals
# -----------------------
settings = get_settings()
gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
user_context = {}  # In-memory chat memory (per user)

# -----------------------
# Prompt for extraction
# -----------------------
extract_prompt = PromptTemplate(
    input_variables=["query"],
    template="""
Extract industry and location from this user query.
Return strictly JSON with both fields. If a field is missing, set its value to null.
Example: {{"industry": "restaurants", "location": "New York"}}
If industry is missing, set "industry": null.
If location is missing, set "location": null.

Query: {query}
"""
)

# -----------------------
# Google Places API helper
# -----------------------
def get_leads(industry: str, location: str, radius: int = 5000, limit: int | None = 5):
    """Fetch leads from Google Places API.
    - limit=None → return all available leads (logged-in user)
    - limit=5 → return only 5 leads (guest)
    """
    geocode = gmaps.geocode(location)
    if not geocode:
        return []

    latlng = geocode[0]["geometry"]["location"]
    results = gmaps.places_nearby(
        location=latlng,
        radius=radius,
        keyword=industry,
    )

    places = results.get("results", [])
    if limit:
        places = places[:limit]

    leads = []
    for place in places:
        place_id = place.get("place_id")
        details = gmaps.place(place_id=place_id).get("result", {})

        leads.append({
            "business_name": place.get("name"),
            "industry": industry,
            "address": place.get("vicinity"),
            "website": details.get("website", "N/A"),
            "contact_number": details.get("formatted_phone_number", "N/A"),
        })
    return leads

# -----------------------
# LLM extraction
# -----------------------
async def run_extraction(message: str, llm: ChatGoogleGenerativeAI):
    """Run LLM to extract industry and location using HumanMessage"""
    prompt_text = extract_prompt.format_prompt(query=message).to_string()
    human_message = HumanMessage(content=prompt_text)

    response = await llm.agenerate([[human_message]])
    extraction_result = response.generations[0][0].text.strip()

    # Clean up JSON markdown from LLM
    if extraction_result.startswith("```json"):
        extraction_result = extraction_result[len("```json"):].strip()
    if extraction_result.startswith("```"):
        extraction_result = extraction_result[3:].strip()
    if extraction_result.endswith("```"):
        extraction_result = extraction_result[:-3].strip()

    return extraction_result

# -----------------------
# Lead Scoring & Summary
# -----------------------
async def score_and_summarize_lead(lead: dict, llm: ChatGoogleGenerativeAI) -> dict:
    """Ask Gemini to score and summarize a lead"""
    prompt = f"""
        You are evaluating a business lead.
        Lead info: {json.dumps(lead)}

        Return JSON with:
        - lead_score (1-100, based on business relevance, info completeness, and credibility)
        - summary (1-2 sentence warm summary of the business)

        Important instructions:
        1. Output must be strictly valid JSON parsable by Python's json.loads().
        2. Escape any double quotes inside string values as \\".
        3. Use only JSON-safe characters; do not include extra symbols that would break JSON.
        4. Do not include markdown, code fences, or extra text outside JSON.
        5. Do not add commentary or explanations.
        6. Use only simple words and phrases without apostrophes.

        Example:
        {{"lead_score": 85, "summary": "A popular restaurant in New York with strong reviews and online presence."}}
        """

    human_message = HumanMessage(content=prompt)
    response = await llm.agenerate([[human_message]])
    result_text = response.generations[0][0].text.strip()

    # Clean up Gemini output
    if result_text.startswith("```json"):
        result_text = result_text[len("```json"):].strip()
    if result_text.startswith("```"):
        result_text = result_text[3:].strip()
    if result_text.endswith("```"):
        result_text = result_text[:-3].strip()

    match = re.search(r"\{.*\}", result_text, re.DOTALL)
    if match:
        result_text = match.group(0)

    try:
        parsed = json.loads(result_text)
        return {
            "lead_score": int(parsed.get("lead_score", 0)),
            "summary": parsed.get("summary", "No summary available.")
        }
    except Exception as e:
        print("⚠️ Failed to parse Gemini output:", result_text, e)
        return {"lead_score": 0, "summary": "No summary available."}

# -----------------------
# Human-like response helper
# -----------------------
async def generate_human_response(user_message: str, context: dict, leads: list, llm: ChatGoogleGenerativeAI):
    """Generate a concise, human-like response using Gemini/LLM"""
    prompt = f"""
You are a friendly assistant helping the user find industry.
Keep replies short (1-3 sentences), natural, and avoid repeating greetings like "hello there".
Give warm reply that is easy to understand and be direct and concise like talking to friend.
User message: {user_message}
Current context: {context}
Leads found: {json.dumps(leads) if leads else 'No leads found'}

Special rules:
- If industry is missing in context, ask warmly to provide industry
- If location is missing in context, ask warmly to provide the location"
- If both are missing, politely ask for both industry and location in one sentence.
- Otherwise, respond normally with a short, helpful reply.

Respond warmly and conversationally, but concise.
If the user goes off-topic, gently redirect them back to finding leads.
"""
    human_message = HumanMessage(content=prompt)
    response = await llm.agenerate([[human_message]])
    return response.generations[0][0].text.strip()

# -----------------------
# Save leads to DB (with enrichment)
# -----------------------
async def save_leads_to_db(leads: list, db: AsyncSession, llm: ChatGoogleGenerativeAI, user: User):
    """Save leads with enrichment (scoring + summary) and link to user"""
    for lead in leads:
        enrichment = await score_and_summarize_lead(lead, llm)

        lead_data = LeadCreate.model_validate({
            "business_name": lead.get("business_name"),
            "industry": lead.get("industry"),
            "contact_number": lead.get("contact_number"),
            "address": lead.get("address"),
            "website": lead.get("website"),
            "lead_score": enrichment.get("lead_score", 0),
            "summary": enrichment.get("summary", ""),
            "verified": False,
            "user_id": user.id,  # ✅ attach logged-in user ID
        })

        db_lead = Lead(**lead_data.model_dump())
        db.add(db_lead)

    await db.commit()

# -----------------------
# Main chat function
# -----------------------
async def chat(message: str, db: AsyncSession, llm: ChatGoogleGenerativeAI, user: User | None = None):
    """Chat pipeline with login-based lead limits and context memory"""
    # Use per-user memory
    user_key = str(user.id) if user else "guest"
    context = user_context.get(user_key, {})

    # 1. Extract intent (industry + location)
    extraction_result = await run_extraction(message, llm)
    try:
        data = json.loads(extraction_result)
    except json.JSONDecodeError:
        warm_text = await generate_human_response(message, context, [], llm)
        return {"message": warm_text}

    # 2. Merge extracted data into stored context
    for key in ["industry", "location"]:
        if key in data and data[key] is not None:
            context[key] = data[key]

    # Save updated context
    user_context[user_key] = context

    # 3. Ask if info missing
    if "industry" not in context or "location" not in context:
        warm_text = await generate_human_response(message, context, [], llm)
        return {"message": warm_text}

    # 4. Apply login rules for lead fetching
    if user:  
        print("✅ [DEBUG] Logged in user detected → fetching all leads")
        lead_limit = 3
    else:
        print("⚠️ [DEBUG] Guest user detected → fetching only 5 leads")
        lead_limit = 5

    leads = get_leads(context["industry"], context["location"], limit=lead_limit)

    # Debug: check how many leads returned
    print(f"📊 [DEBUG] Leads fetched: {len(leads)}")
    if leads:
        print("📌 [DEBUG] First lead:", leads[0])

    # 5. Save leads only if user is logged in
    if user and leads:
        await save_leads_to_db(leads, db, llm, user)
        print("💾 [DEBUG] Leads saved to DB")
    else:
        print("🚫 [DEBUG] Skipped saving leads (guest mode)")

    # 6. Generate final warm response
    warm_text = await generate_human_response(message, context, leads, llm)

    return {
        "context": context,
        "message": warm_text,
        "leads": leads,
    }
