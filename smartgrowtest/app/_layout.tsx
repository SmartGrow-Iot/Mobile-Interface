import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

import { useColorScheme } from "@/hooks/useColorScheme";

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
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
