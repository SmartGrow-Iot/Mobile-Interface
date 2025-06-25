import { Redirect, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Give the app a moment to initialize
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while authentication is initializing
  if (loading || !appReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Text style={{ fontSize: 16, color: "#333" }}>Loading...</Text>
      </View>
    );
  }

  // If authenticated, redirect to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Show authentication screens
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
        initialRouteName="signin"
      >
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgotpassword" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
