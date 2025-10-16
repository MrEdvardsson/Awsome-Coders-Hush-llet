import { Stack } from "expo-router";

export default function ChoresLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Hushåll", headerShown: false }}
      />
      <Stack.Screen name="chore-details" options={{ title: "Detaljer" }} />
      <Stack.Screen name="add-chore" options={{ title: "Lägg till syssla" }} />
      <Stack.Screen name="edit-chore" options={{ title: "Redigera syssla" }} />
    </Stack>
  );
}
