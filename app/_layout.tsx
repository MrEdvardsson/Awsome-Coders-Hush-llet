import { darkTheme, lightTheme } from "@/constants/app-theme";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="housePage/houseHoldScreen"
          options={{ title: "Hushåll" }}
        />
      </Stack>
    </PaperProvider>
  );
}
