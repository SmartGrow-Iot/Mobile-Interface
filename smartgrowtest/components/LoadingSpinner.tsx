// components/ui/LoadingSpinner.tsx
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

type LoadingSpinnerProps = {
  size?: "small" | "large";
  color?: string;
  text?: string;
  overlay?: boolean;
};

export function LoadingSpinner({
  size = "large",
  color = "#174d3c",
  text,
  overlay = false,
}: LoadingSpinnerProps) {
  const Container = overlay ? View : React.Fragment;
  const containerProps = overlay ? { style: styles.overlay } : {};

  return (
    <Container {...containerProps}>
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
