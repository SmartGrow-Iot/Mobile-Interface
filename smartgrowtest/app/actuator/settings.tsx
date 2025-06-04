// app/actuator/settings.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { EmptyState } from "../../components/ui/EmptyState";

export default function ActuatorSettings() {
  return (
    <View style={styles.container}>
      <Header title="Actuator Settings" showBackButton={true} />

      <View style={styles.content}>
        <EmptyState
          icon="settings-outline"
          title="Actuator Settings"
          subtitle="Configure default actuator behaviors and preferences"
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
