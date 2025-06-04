import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

type User = {
  id: string;
  email: string;
  name: string;
  groupNumber: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    groupNumber: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userData: User = {
      id: "1",
      email,
      name: "John Doe",
      groupNumber: "10",
    };

    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    groupNumber: string
  ) => {
    try {
      const response = await authService.register({
        name, // This will be mapped to display_name in the service
        email,
        password,
        // Note: groupNumber is not sent to the API since it's not expected
      });

      // Create user data from the API response
      const userData: User = {
        id: response.user?.id || response.id || "temp-id",
        email: response.user?.email || response.email || email,
        name: response.user?.display_name || response.display_name || name,
        groupNumber: groupNumber, // Keep this locally since API doesn't handle it
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error((error as Error).message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
