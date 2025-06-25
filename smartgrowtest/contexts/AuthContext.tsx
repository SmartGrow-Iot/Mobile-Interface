import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { authService } from "../services/authService";
import { sendPasswordResetEmail } from "firebase/auth";

type User = {
  id: string;
  email: string;
  name: string;
  groupNumber: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    groupNumber: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser: FirebaseUser | null) => {
          try {
            if (firebaseUser) {
              const userData: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || "User",
                groupNumber: "", // You can fetch this from your API if needed
              };
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error processing auth state:", error);
            setUser(null);
            setIsAuthenticated(false);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Firebase auth error:", error);
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error cleaning up auth listener:", error);
        }
      }
    };
  }, []);

  // Register via your API (creates user in Firebase server-side)
  const signup = async (
    name: string,
    email: string,
    password: string,
    groupNumber: string
  ) => {
    try {
      setLoading(true);

      // Call your API to create user in Firebase (server-side)
      await authService.register({
        email,
        password,
        display_name: name, // Changed from 'name' to 'display_name'
        group: parseInt(groupNumber), // Changed from 'groupNumber' to 'group', and convert to number
      });

      // After successful registration, automatically log them in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Login with Firebase Auth
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Login failed";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Try again later";
      }

      throw new Error(errorMessage);
    }
  };

  // Logout with Firebase Auth
  const logout = async () => {
    try {
      await signOut(auth);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Logout failed");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      // Firebase automatically sends the reset email
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      }

      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
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
