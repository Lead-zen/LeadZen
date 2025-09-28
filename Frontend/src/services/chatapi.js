// src/services/chatapi.js
import axiosInstance from "./axiosInstance";

// ---------------------
// Guest Chat (no login)
// ---------------------
const PUBLIC_API_URL = "http://localhost:8000/chat/";

/**
 * Sends a chat message for guest (non-logged in user).
 * @param {string} message - The message to send
 * @returns {Promise<any>} - The backend response
 */
export async function sendChatMessage(message) {
  try {
    const response = await fetch(PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data; // flexible for guest chat
  } catch (error) {
    console.error("Error sending guest chat message:", error);
    throw error;
  }
}

// ---------------------
// Authenticated Chat (logged-in users)
// ---------------------
const API_URL = "/chat"; // axiosInstance already knows baseURL

/**
 * Sends a chat message for logged-in users and retrieves enriched leads.
 * @param {string} message - The query to send
 * @returns {Promise<{ context: object, message: string, leads: any[] }>}
 */
export async function chatLeads(message) {
  try {
    const response = await axiosInstance.post(API_URL, { message });
    // backend returns { context, message, leads }
    return response.data;
  } catch (error) {
    console.error("Error fetching leads (logged-in):", error);
    throw error;
  }
}
