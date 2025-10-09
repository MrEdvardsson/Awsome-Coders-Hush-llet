import IonIcons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index.tsx"
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistik.tsx"
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
