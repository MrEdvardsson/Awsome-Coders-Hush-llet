import { AuthCacheListener } from "@/auth";
import { darkTheme, lightTheme } from "@/constants/app-theme";
import { auth } from "@/firebase-config";
import { useReactQuerySetup } from "@/hooks/use-react-query-setup";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import RootNavigation from "./root-navigation";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
export default function RootLayout() {
  // LogInFireBase();
  // LogOutFireBase();
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
        {/*Navigerar till rätt sida baserat på autentisering*/}
        <RootNavigation />
      </PaperProvider>
    </QueryClientProvider>
  );
}

// Endast en test funktion för att testa om inloggningen fungerar.
// Har skapat en användare i Firebase Console med dessa uppgifter.
// Så om ni vill testa så kan nu köra denn funktionen vid uppstart, lägg till dessa i er egna databas.
// Och kör funktionen LogInFireBase(); Vid uppstart av appen.
export async function LogInFireBase() {
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

//Endast testmetod för att logga ut användaren och se så man blir skickad till login sidan.
export async function LogOutFireBase() {
  try {
    await auth.signOut();
    console.log("Användare utloggad");
  } catch (error) {
    console.error("Fel vid utloggning:", error);
  }
}
