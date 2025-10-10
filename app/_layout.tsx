import { darkTheme, lightTheme } from "@/constants/app-theme";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/HousePage"
          options={{ title: "Hushåll", headerShown: false }}
        />
        <Stack.Screen
          name="screens/LoginPage"
          options={{ headerShown: false }}
        />
      </Stack>
    </PaperProvider>
  );
}
