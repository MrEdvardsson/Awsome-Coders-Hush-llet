import HeaderMenu from "@/components/header-menu";
import { useAppTheme } from "@/constants/app-theme";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          color: theme.colors.onSurface,
        },
        headerRight: () => <HeaderMenu />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Hem",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="create-household"
        options={{ title: "Skapa hushåll" }}
      ></Stack.Screen>
      <Stack.Screen
        name="join-household"
        options={{ title: "Gå med i hushåll" }}
      ></Stack.Screen>
    </Stack>
  );
}
