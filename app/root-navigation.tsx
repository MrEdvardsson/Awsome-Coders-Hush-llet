import { useAuthUser } from "../auth";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
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
          name={"screens/loginpage/index"}
          options={{ headerShown: false, title: "Logga in" }}
        ></Stack.Screen>
      </Stack.Protected>
      <Stack.Protected guard={user !== null}>
        <Stack.Screen
          name={"screens/housepage/index"}
          options={{ headerShown: false, title: "Hem" }}
        ></Stack.Screen>
      </Stack.Protected>
    </Stack>
  );
}
