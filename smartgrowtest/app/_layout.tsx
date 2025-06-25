import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import React, { ErrorInfo, ReactNode } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

import { useColorScheme } from "@/hooks/useColorScheme";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, color: "#e74c3c", marginBottom: 10, textAlign: 'center' }}>
            Oops! Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: 'center' }}>
            Please restart the app or contact support if the problem persists.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();

  if (loading) {
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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
        {/* Auth Screens */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="getting-started" />

        {/* Main App */}
        <Stack.Screen name="(tabs)" />

        {/* Other Screens */}
        <Stack.Screen name="sensors/[sensor]" />
        <Stack.Screen name="plants/zone/[zone]" />
        <Stack.Screen name="plants/[plant]" />

        {/* Actuator Screens */}
        <Stack.Screen name="actuator" />

        {/* Notifications Screen */}
        <Stack.Screen name="notifications" />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}
