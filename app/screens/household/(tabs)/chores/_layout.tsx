import { useAppTheme } from "@/constants/app-theme";
import { Stack } from "expo-router";

export default function ChoresLayout() {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "default",
        presentation: "card",
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Hushåll",
        }}
      />
      <Stack.Screen
        name="chore-details"
        options={{
          title: "Detaljer",
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="add-chore"
        options={{
          title: "Lägg till syssla",
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="edit-chore"
        options={{
          title: "Redigera syssla",
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
