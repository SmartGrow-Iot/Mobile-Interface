// services/api.js
import { auth } from "../config/firebaseConfig";

const API_BASE_URL = "https://test-server-owq2.onrender.com/api/v1";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get Firebase token for authenticated requests
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
