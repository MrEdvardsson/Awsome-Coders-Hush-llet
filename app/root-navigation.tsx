import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthUser } from "../auth";
import HeaderMenu from "@/components/header-menu";
SplashScreen.preventAutoHideAsync();

export default function RootNavigation() {
  const { data: user } = useAuthUser();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  //Navigerar till rätt sida baserat på autentisering
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/*Splash screenen körs först*/}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name={"screens/login/index"}
          options={{ headerShown: false, title: "Logga in" }}
        ></Stack.Screen>
      </Stack.Protected>
      <Stack.Protected guard={user !== null}>
        <Stack.Screen
          name={"screens/home"}
          options={{ headerShown: false, title: "Hem" }}
        ></Stack.Screen>
        <Stack.Screen
          name="screens/household/(tabs)"
          options={{
            headerShown: false,
            title: "Hushåll",
            headerTitleAlign: "center",
            headerRight: () => <HeaderMenu />,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
