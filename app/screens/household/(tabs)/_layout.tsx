import { useAppTheme } from "@/constants/app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HouseholdLayout() {
  const theme = useAppTheme();

  return (
    //använda hushållets namn som header title??
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="chores"
        options={{
          title: "Hushåll",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistik",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
