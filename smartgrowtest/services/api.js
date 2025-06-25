import { auth } from "../config/firebaseConfig";

const API_BASE_URL = "https://test-server-owq2.onrender.com/api/v1";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Get Firebase token for authenticated requests
    let token = null;
    try {
      const user = auth.currentUser;
      token = user ? await user.getIdToken() : null;
    } catch (authError) {
      console.warn("Auth token retrieval failed:", authError);
      // Continue without token for non-authenticated requests
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: 30000, // 30 second timeout
      ...options,
    };

    const response = await Promise.race([
      fetch(url, config),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]);

    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn("Server returned non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    
    // Provide more helpful error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    } else if (error.message === 'Request timeout') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};
