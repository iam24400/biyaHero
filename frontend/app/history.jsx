import { View, Text, Button, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";

export default function HistoryPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ride History</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.line} />
        <Text> ➡️ </Text>
        <Text>00:00 AM/PM - 00/00/00</Text>
        <Text>00 min | 0 km | ₱00</Text>
        <Button
          title="re-route"
          onPress={() => {
            router.push("/route");
          }}
        />
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.line} />
        <Text> ➡️ </Text>
        <Text>00:00 AM/PM - 00/00/0000</Text>
        <Text>00 min | 0 km | ₱00</Text>
        <Button
          title="re-route"
          onPress={() => {
            router.push("/route");
          }}
        />
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.line} />
        <Text> ➡️ </Text>
        <Text>00:00 AM/PM - 00/00/0000</Text>
        <Text>00 min | 0 km | ₱00</Text>
        <Button
          title="re-route"
          onPress={() => {
            router.push("/route");
          }}
        />
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.line} />
        <Text> ➡️ </Text>
        <Text>00:00 AM/PM - 00/00/0000</Text>
        <Text>00 min | 0 km | ₱00</Text>
        <Button
          title="re-route"
          onPress={() => {
            router.push("/route");
          }}
        />
      </View>

      <Button
        title="Back to Home"
        onPress={() => router.push("/")}
        color="gray"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden", // to make image stay inside border
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  line: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
