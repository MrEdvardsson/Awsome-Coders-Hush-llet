import { focusManager, onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

/**
 * Ställer in React Query till att fungera i ett Expo projekt.
 * https://tanstack.com/query/v5/docs/framework/react/react-native
 **/
console.log("Nu körs useReactQuerySetup");
export function useReactQuerySetup() {
  useEffect(() => {
    // Säkerställer att React Query vet om nätverksförändringar.
    onlineManager.setEventListener((setOnline) => {
      const eventSubscription = Network.addNetworkStateListener((state) => {
        setOnline(!!state.isConnected);
      });
      return eventSubscription.remove;
    });

    // Säkerställer att React Query vet om när appen får fokus
    const appStateSubscription = AppState.addEventListener(
      "change",
      (status) => {
        if (Platform.OS !== "web") {
          focusManager.setFocused(status === "active");
        }
      }
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);
}
