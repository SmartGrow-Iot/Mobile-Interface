import { apiRequest } from "./api";

export const authService = {
  register: async (userData) => {
    // Map your form data to the API's expected format
    const apiData = {
      email: userData.email,
      password: userData.password,
      display_name: userData.display_name,
      group: userData.group,
    };

    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(apiData),
    });
  },

  login: async (credentials) => {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};
