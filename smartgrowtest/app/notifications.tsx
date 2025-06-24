// app/notifications.tsx - Blank page with just header
import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";

export default function NotificationsScreen() {
  const router = useRouter();

  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Notifications" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Empty content area - ready for your new implementation */}
      <View style={styles.content}>
        {/* Add your new notification content here */}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
