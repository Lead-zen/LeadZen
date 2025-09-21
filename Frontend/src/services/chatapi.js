// chatApi.js
const API_BASE_URL = "http://localhost:8000";

/**
 * Sends a message to the FastAPI backend chat endpoint.
 * @param {string} userId - The ID of the user
 * @param {string} message - The message to send
 * @returns {Promise<Object>} - Returns bot response { bot, table }
 */
export const sendMessageToBackend = async (userId, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, message }),
    });

    if (!response.ok) throw new Error("Network error");

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return { bot: "⚠️ Something went wrong. Please try again." };
  }
};
