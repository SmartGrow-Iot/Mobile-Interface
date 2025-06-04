import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ActuatorLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="override" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
