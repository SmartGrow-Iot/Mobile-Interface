// app/actuator/history.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { EmptyState } from "../../components/ui/EmptyState";

export default function ActuatorHistory() {
  return (
    <View style={styles.container}>
      <Header title="Actuator History" showBackButton={true} />

      <View style={styles.content}>
        <EmptyState
          icon="time-outline"
          title="Actuator History"
          subtitle="View past actuator activations and schedules"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
