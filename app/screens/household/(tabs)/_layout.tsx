import { Tabs } from "expo-router";
import { useAppTheme } from "@/constants/app-theme";
import { List } from "react-native-paper";

export default function HouseholdLayout() {
    const theme = useAppTheme();

    return (
        //använda hushållets namn som header title??
        <Tabs screenOptions={
            { 
                headerTitleAlign: "center",
                tabBarActiveTintColor: theme.colors.primary,
                tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.primary },
                tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
            }
        }
        >
            <Tabs.Screen name="chores" options={{ title: "Hushåll", headerShown: false }}/>
            <Tabs.Screen name="statistics" options={{ title: "Statistik", headerShown: false}}/>
        </Tabs>
    );
}