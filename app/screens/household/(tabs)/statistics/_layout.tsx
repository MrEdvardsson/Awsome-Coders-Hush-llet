import { Stack } from "expo-router";

export default function ChoresLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Hushåll", headerShown: false }}/>
        </Stack>
    );
}