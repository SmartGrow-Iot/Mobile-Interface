import { apiRequest } from "./api";

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    return await apiRequest("/user/me");
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiRequest("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};
