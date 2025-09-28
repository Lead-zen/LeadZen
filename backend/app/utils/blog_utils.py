def generate_toc(content_json: dict):
    """
    Generate Table of Contents from blog content JSON.
    Extracts headings (h1, h2, h3) for sidebar display.
    """
    toc = []
    for block in content_json.get("blocks", []):
        if block["type"] in ["h1", "h2", "h3"]:
            toc.append({
                "level": int(block["type"][1]),  # 1, 2, 3
                "text": block["text"]
            })
    return toc
