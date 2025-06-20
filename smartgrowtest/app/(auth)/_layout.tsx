import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
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
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
