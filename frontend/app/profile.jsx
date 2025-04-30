import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router"; // 👈 Add this for navigation

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [favoritesVisible, setFavoritesVisible] = useState(false);
  const router = useRouter(); // 👈 Initialize router

  const favoriteRoutes = [
    { id: "1", name: "Route to Downtown" },
    { id: "2", name: "Route to Park" },
    { id: "3", name: "Route to University" },
  ];

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled"
    );
  };

  const handleSignOut = () => {
    Alert.alert("Signed Out", "You have been signed out.");
  };

  const handleRouteSelect = (route) => {
    setFavoritesVisible(false);
    router.push("/route"); // 👈 Navigate to RoutePage
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.name}>Biya Hero</Text>
        <Text style={styles.email}>@biyahero.gmail.com</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Settings Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleToggleNotifications}>
          <Text style={styles.optionText}>
            {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setFavoritesVisible(true)}>
          <Text style={styles.optionText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites Modal */}
      <Modal visible={favoritesVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Favorite Routes</Text>
          <FlatList
            data={favoriteRoutes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.routeCard}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeName}>{item.name}</Text>
                  <Text style={styles.routeDetails}>
                    00:00 AM/PM - 00/00/0000{"\n"}
                    00 min | 0 km | ₱00
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.rerouteButton}
                  onPress={() => handleRouteSelect(item)}
                >
                  <Text style={styles.rerouteButtonText}>RE-ROUTE</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity style={styles.closeButton} onPress={() => setFavoritesVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  profileSection: { alignItems: "center", marginTop: 40 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 14, color: "gray" },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
    marginHorizontal: 30,
  },
  optionsContainer: {
    marginTop: 10,
    gap: 15,
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  routeCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  routeInfo: {
    padding: 15,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  routeDetails: {
    fontSize: 14,
    color: "gray",
    lineHeight: 20,
  },
  rerouteButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    alignItems: "center",
  },
  rerouteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
