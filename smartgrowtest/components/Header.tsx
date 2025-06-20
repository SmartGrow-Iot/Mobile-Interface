// components/Header.tsx - Complete Header with notification support
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationIcon } from "./features/notifications/NotificationIcon";

type BreadcrumbItem = {
  label: string;
  route?: string;
};

type SearchResult = {
  title: string;
  subtitle?: string;
  route: string;
  type: "page" | "sensor" | "plant" | "zone";
  icon?: string;
};

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
  showNotifications?: boolean; // New prop for notification icon
  breadcrumbs?: BreadcrumbItem[];
  customBreadcrumbs?: BreadcrumbItem[];
};

// Search data - you can expand this with more content from your app
const searchData: SearchResult[] = [
  // Pages
  {
    title: "My Plants",
    subtitle: "Home page",
    route: "/",
    type: "page",
    icon: "🏠",
  },
  {
    title: "Explore",
    subtitle: "Learning resources",
    route: "/(tabs)/explore",
    type: "page",
    icon: "📚",
  },
  {
    title: "Sensors",
    subtitle: "All sensors",
    route: "/(tabs)/sensors",
    type: "page",
    icon: "⚡",
  },
  {
    title: "Profile",
    subtitle: "Your profile",
    route: "/(tabs)/profile",
    type: "page",
    icon: "👤",
  },

  // Sensors
  {
    title: "Light Sensor",
    subtitle: "Monitor light levels",
    route: "/sensors/light",
    type: "sensor",
    icon: "☀️",
  },
  {
    title: "Soil Sensor",
    subtitle: "Monitor soil moisture",
    route: "/sensors/soil",
    type: "sensor",
    icon: "🟫",
  },
  {
    title: "Air Quality Sensor",
    subtitle: "Monitor air quality",
    route: "/sensors/airquality",
    type: "sensor",
    icon: "🌬️",
  },
  {
    title: "Temperature Sensor",
    subtitle: "Monitor temperature",
    route: "/sensors/temperature",
    type: "sensor",
    icon: "🌡️",
  },
  {
    title: "Humidity Sensor",
    subtitle: "Monitor humidity",
    route: "/sensors/humidity",
    type: "sensor",
    icon: "💧",
  },

  // Zones
  {
    title: "Zone A",
    subtitle: "Chili plants area",
    route: "/plants/zone/Zone A",
    type: "zone",
    icon: "🌶️",
  },
  {
    title: "Zone B",
    subtitle: "Chili plants area",
    route: "/plants/zone/Zone B",
    type: "zone",
    icon: "🌶️",
  },
  {
    title: "Zone C",
    subtitle: "Eggplant area",
    route: "/plants/zone/Zone C",
    type: "zone",
    icon: "🍆",
  },
  {
    title: "Zone D",
    subtitle: "Eggplant area",
    route: "/plants/zone/Zone D",
    type: "zone",
    icon: "🍆",
  },

  // Plants
  {
    title: "Chili Plant 1",
    subtitle: "Zone A - CP-1",
    route: "/plants/CP-1",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 2",
    subtitle: "Zone A - CP-2",
    route: "/plants/CP-2",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 3",
    subtitle: "Zone A - CP-3",
    route: "/plants/CP-3",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 4",
    subtitle: "Zone A - CP-4",
    route: "/plants/CP-4",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 5",
    subtitle: "Zone B - CP-5",
    route: "/plants/CP-5",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 6",
    subtitle: "Zone B - CP-6",
    route: "/plants/CP-6",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 7",
    subtitle: "Zone B - CP-7",
    route: "/plants/CP-7",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Chili Plant 8",
    subtitle: "Zone B - CP-8",
    route: "/plants/CP-8",
    type: "plant",
    icon: "🌶️",
  },
  {
    title: "Eggplant 1",
    subtitle: "Zone C - EP-1",
    route: "/plants/EP-1",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 2",
    subtitle: "Zone C - EP-2",
    route: "/plants/EP-2",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 3",
    subtitle: "Zone C - EP-3",
    route: "/plants/EP-3",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 4",
    subtitle: "Zone C - EP-4",
    route: "/plants/EP-4",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 5",
    subtitle: "Zone D - EP-5",
    route: "/plants/EP-5",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 6",
    subtitle: "Zone D - EP-6",
    route: "/plants/EP-6",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 7",
    subtitle: "Zone D - EP-7",
    route: "/plants/EP-7",
    type: "plant",
    icon: "🍆",
  },
  {
    title: "Eggplant 8",
    subtitle: "Zone D - EP-8",
    route: "/plants/EP-8",
    type: "plant",
    icon: "🍆",
  },
];

export default function Header({
  title,
  showBackButton = false,
  showSearch = false,
  showProfile = false,
  showNotifications = false, // Default false for backward compatibility
  breadcrumbs,
  customBreadcrumbs,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useNotifications(); // Get unread notification count

  // Search state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Auto-generate breadcrumbs based on current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) return customBreadcrumbs;
    if (breadcrumbs) return breadcrumbs;

    const pathSegments = pathname.split("/").filter((segment) => segment);
    const crumbs: BreadcrumbItem[] = [{ label: "Home", route: "/" }];

    // Map path segments to readable labels
    const pathLabels: Record<string, string> = {
      sensors: "Sensors",
      explore: "Explore",
      profile: "Profile",
      plants: "Plants",
      zone: "Zone",
      notifications: "Notifications",
      light: "Light Sensor",
      soil: "Soil Sensor",
      airquality: "Air Quality Sensor",
      temperature: "Temperature Sensor",
      humidity: "Humidity Sensor",
    };

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip dynamic segments (those in brackets)
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return;
      }

      const label =
        pathLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      // Don't add route for the last segment (current page)
      if (index === pathSegments.length - 1) {
        crumbs.push({ label });
      } else {
        crumbs.push({ label, route: currentPath });
      }
    });

    return crumbs;
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle &&
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort results by relevance (exact matches first, then contains)
    const sortedResults = filteredResults.sort((a, b) => {
      const aExact = a.title
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());
      const bExact = b.title
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    setSearchResults(sortedResults.slice(0, 8)); // Limit to 8 results
  }, [searchQuery]);

  const breadcrumbItems = generateBreadcrumbs();

  const handleBreadcrumbPress = (route: string) => {
    router.push(route as any);
  };

  const handleSearchPress = () => {
    setIsSearchVisible(true);
  };

  const handleSearchClose = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchResultPress = (result: SearchResult) => {
    router.push(result.route as any);
    handleSearchClose();
  };

  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "#174d3c";
      case "sensor":
        return "#3498db";
      case "plant":
        return "#27ae60";
      case "zone":
        return "#e67e22";
      default:
        return "#666";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "page":
        return "Page";
      case "sensor":
        return "Sensor";
      case "plant":
        return "Plant";
      case "zone":
        return "Zone";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Header Row */}
      <View style={styles.headerRow}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#174d3c" />
            </TouchableOpacity>
          ) : (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
        </View>

        {/* Center Title (when back button is shown) */}
        {showBackButton && (
          <View style={styles.centerSection}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}

        {/* Right Side */}
        <View style={styles.rightSection}>
          {showSearch && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSearchPress}
            >
              <Ionicons name="search" size={22} color="#174d3c" />
            </TouchableOpacity>
          )}
          {/* Notification Icon - NEW */}
          {showNotifications && (
            <NotificationIcon
              unreadCount={unreadCount}
              onPress={handleNotificationsPress}
              iconColor="#174d3c"
              iconSize={22}
            />
          )}
          {showProfile && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Ionicons
                name="person-circle-outline"
                size={26}
                color="#174d3c"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Breadcrumbs */}
      {breadcrumbItems.length > 1 && (
        <View style={styles.breadcrumbContainer}>
          {breadcrumbItems.map((crumb, index) => (
            <View key={index} style={styles.breadcrumbItem}>
              {crumb.route ? (
                <TouchableOpacity
                  onPress={() => handleBreadcrumbPress(crumb.route!)}
                >
                  <Text style={styles.breadcrumbLink}>{crumb.label}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.breadcrumbCurrent}>{crumb.label}</Text>
              )}

              {index < breadcrumbItems.length - 1 && (
                <Text style={styles.breadcrumbSeparator}> / </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleSearchClose}
      >
        <View style={styles.searchOverlay}>
          <View style={styles.searchContainer}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
              <View style={styles.searchInputContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search plants, sensors, zones..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                  placeholderTextColor="#999"
                />
              </View>
              <TouchableOpacity
                style={styles.searchCloseButton}
                onPress={handleSearchClose}
              >
                <Text style={styles.searchCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Search Results */}
            <ScrollView
              style={styles.searchResults}
              showsVerticalScrollIndicator={false}
            >
              {searchQuery.trim() === "" ? (
                <View style={styles.searchEmptyState}>
                  <Ionicons name="search" size={48} color="#ccc" />
                  <Text style={styles.searchEmptyText}>
                    Start typing to search
                  </Text>
                  <Text style={styles.searchEmptySubtext}>
                    Find plants, sensors, zones, and pages
                  </Text>
                </View>
              ) : searchResults.length === 0 ? (
                <View style={styles.searchEmptyState}>
                  <Ionicons name="sad-outline" size={48} color="#ccc" />
                  <Text style={styles.searchEmptyText}>No results found</Text>
                  <Text style={styles.searchEmptySubtext}>
                    Try searching for something else
                  </Text>
                </View>
              ) : (
                searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => handleSearchResultPress(result)}
                  >
                    <View style={styles.searchResultLeft}>
                      <Text style={styles.searchResultIcon}>{result.icon}</Text>
                      <View style={styles.searchResultContent}>
                        <Text style={styles.searchResultTitle}>
                          {result.title}
                        </Text>
                        {result.subtitle && (
                          <Text style={styles.searchResultSubtitle}>
                            {result.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View
                      style={[
                        styles.searchResultBadge,
                        { backgroundColor: getTypeColor(result.type) },
                      ]}
                    >
                      <Text style={styles.searchResultBadgeText}>
                        {getTypeBadge(result.type)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 44,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    minHeight: 44,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    flexWrap: "wrap",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbLink: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: "#174d3c",
    fontWeight: "500",
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: "#999",
  },
  // Search Modal Styles
  searchOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 44,
  },
  searchContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  searchCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchCloseText: {
    color: "#174d3c",
    fontSize: 16,
    fontWeight: "500",
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchEmptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  searchEmptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  searchEmptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  searchResultLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchResultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchResultBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
