import { Tabs } from "expo-router";


export default function HouseholdLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="chores" options={{ title: "Hushåll", headerShown: false }}/>
            <Tabs.Screen name="statistics" options={{ title: "Statistik", headerShown: false }}/>
        </Tabs>
    );
}