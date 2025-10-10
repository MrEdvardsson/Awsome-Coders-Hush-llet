import { AuthCacheListener } from "@/auth";
import { darkTheme, lightTheme } from "@/constants/app-theme";
import { auth } from "@/firebase-config";
import { useReactQuerySetup } from "@/hooks/use-react-query-setup";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
export default function RootLayout() {
  // LogInFireBase();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useReactQuerySetup();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        {/* En komponent som lyssnar på auth förändringar */}
        <AuthCacheListener />
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
    </QueryClientProvider>
  );
}

// Endast en test funktion för att testa om inloggningen fungerar.
// Har skapat en användare i Firebase Console med dessa uppgifter.
// Så om ni vill testa så kan nu köra denn funktionen vid uppstart, lägg till dessa i er egna databas.
// Och kör funktionen LogInFireBase(); Vid uppstart av appen.
async function LogInFireBase() {
  const email = "alexander@gmail.com";
  const password = "alexander123";

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Inloggad användare:", user);
  } catch (error) {
    console.error("Fel vid inloggning:", error);
  }
}
