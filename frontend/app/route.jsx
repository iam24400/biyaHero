import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function RoutePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BiyaHero</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchField}>
          <Text style={styles.label}>From:</Text>
          <TextInput
            placeholder="Batangas Terminal"
            style={styles.input}
          />
        </View>
        <View style={styles.searchField}>
          <Text style={styles.label}>To:</Text>
          <TextInput
            placeholder="Batangas Pier"
            style={styles.input}
          />
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.map}>
        <Text style={styles.mapText}>🗺️ Map Placeholder</Text>
      </View>

      {/* Route Info Section */}
      <ScrollView style={styles.routeInfo}>

        <View style={styles.routeSummary}>
          <Text style={styles.routeTitle}>Terminal - Pier</Text>
          <Text style={styles.routeDetails}>5 min · 400 m</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.tabText}>Alangilan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.tabTextGray}>Possible Routes</Text>
          </TouchableOpacity>
        </View>

        {/* Stops List */}
        <View style={styles.stopList}>
          <View style={styles.stopItem}>
            <Text style={styles.stopIcon}>🛑</Text>
            <Text style={styles.stopName}>Terminal</Text>
            <Text style={styles.stopTime}>9:51</Text>
          </View>
          <View style={styles.stopItem}>
            <Text style={styles.stopIcon}>🛑</Text>
            <Text style={styles.stopName}>Lawas/Calikanto</Text>
            <Text style={styles.stopTime}>10:15</Text>
          </View>
          <View style={styles.stopItem}>
            <Text style={styles.stopIcon}>🛑</Text>
            <Text style={styles.stopName}>Diversion Road</Text>
            <Text style={styles.stopTime}>10:30</Text>
          </View>
          <View style={styles.stopItem}>
            <Text style={styles.stopIcon}>🛑</Text>
            <Text style={styles.stopName}>Pier</Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => alert("Route Started!")}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backArrow: { fontSize: 24, marginRight: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
  searchBarContainer: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  searchField: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
  },
  map: {
    height: 200,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  mapText: {
    fontSize: 16,
    color: "#777",
  },
  routeInfo: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  routeSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  routeDetails: {
    fontSize: 14,
    color: "gray",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  activeTab: {
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  inactiveTab: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabText: {
    fontWeight: "bold",
  },
  tabTextGray: {
    fontWeight: "bold",
    color: "gray",
  },
  stopList: {
    marginTop: 20,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stopIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  stopName: {
    flex: 1,
    fontSize: 16,
  },
  stopTime: {
    fontSize: 14,
    color: "gray",
  },
  startButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
