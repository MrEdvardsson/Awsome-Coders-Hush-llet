import { Stack } from "expo-router";

export default function ChoresLayout() {
    return (
        <Stack screenOptions={
            { 
                headerTitleAlign: "center",

            }
        }>
            <Stack.Screen name="index" options={{ title: "Hushåll",}}/>
            <Stack.Screen name="chore-details" options={{ title: "Detaljer",}}/>
        </Stack>
    );
}