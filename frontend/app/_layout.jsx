import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = 'home';
          } else if (route.name === 'history') {
            iconName = 'time';
          } else if (route.name === 'profile') {
            iconName = 'person';
          } else if (route.name === 'route') {
            iconName = 'navigate'; // 🧭 navigation icon
          } else if (route.name === 'update') {
            iconName = 'warning'; // ⚠️ warning icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="route" options={{ title: "Route" }} />
      <Tabs.Screen name="update" options={{ title: "Update" }} />
    </Tabs>
  );
}
