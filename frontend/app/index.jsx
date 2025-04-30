import { useState } from "react";
import { View, Text, Button, ScrollView, Image, StyleSheet, Modal, Pressable } from "react-native";
import LOGO from '../assets/images/LOGO.png'; // ✅ Correct logo import

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Top Section (Text Left + Image Right) */}
        <View style={styles.topSection}>
          <View>
            <Text style={styles.title}>Welcome to BiyaHero</Text>
            <Text>Your Commute, Simplified</Text>
          </View>

          {/* Image at Upper Right */}
          <Image
            source={LOGO} // ✅ Use imported LOGO
            style={styles.profileImage}
          />
        </View>

        {/* Road Updates Section */}
        <Text style={styles.sectionTitle}>Road Updates</Text>

        {/* Cards */}
        <View style={styles.card}>
          <View style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text>⚠️ Warning</Text>
            <Text>🕒 12:00 PM</Text>
            <Text>📍 Location</Text>
            <Button title="More Info" onPress={() => setModalVisible(true)} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text>⚠️ Warning</Text>
            <Text>🕒 12:00 PM</Text>
            <Text>📍 Location</Text>
            <Button title="More Info" onPress={() => setModalVisible(true)} />
          </View>
        </View>

        {/* Additional Cards */}
        <View style={styles.card}>
          <View style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text>⚠️ Warning</Text>
            <Text>🕒 12:00 PM</Text>
            <Text>📍 Location</Text>
            <Button title="More Info" onPress={() => setModalVisible(true)} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text>⚠️ Warning</Text>
            <Text>🕒 12:00 PM</Text>
            <Text>📍 Location</Text>
            <Button title="More Info" onPress={() => setModalVisible(true)} />
          </View>
        </View>

        {/* Modal for More Info */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Road Update Details</Text>
              <Text>.</Text>

              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 30, 
    paddingTop: 30,  
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionTitle: { 
    fontSize: 18, 
    marginVertical: 30 
  },
  card: { 
    width: "100%",
    height: 250, /* 🔥 Bigger for image + details */
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "50%", /* 🔥 Half of the card */
    backgroundColor: "#ccc", /* 🔥 Gray placeholder for now */
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
