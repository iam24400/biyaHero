import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function UpdatesPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Road Updates</Text>

      <View style={styles.updateCard}>
        <Text>⚠️ Accident at Main Street</Text>
        <Text>🕒 10:30 AM</Text>
      </View>

      <View style={styles.updateCard}>
        <Text>⚠️ Traffic Jam in Downtown</Text>
        <Text>🕒 11:15 AM</Text>
      </View>

      <Button title="Back to Home" onPress={() => router.push("/")} color="gray" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  updateCard: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
});
