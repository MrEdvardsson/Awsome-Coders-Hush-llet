import { useAppTheme } from "@/constants/app-theme";
import { Stack } from "expo-router";

export default function ChoresLayout() {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onBackground,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Statistik", headerShown: true }}
      />
    </Stack>
  );
}
