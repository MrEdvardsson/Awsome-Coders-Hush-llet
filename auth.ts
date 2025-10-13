// Ska returnera en query från tAnstack react query som kollar om användaren är inloggad eller inte
import { auth } from "@/firebase-config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect } from "react";

export const AUTH_KEY = ["auth", "user"] as const;

// En hook som läser auth läget.
export function useAuthUser() {
  const query = useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => {
      return new Promise<User | null>((resolve) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          return resolve(currentUser);
        } else {
          const unsubscribe = onAuthStateChanged(auth, (userOrNull) => {
            unsubscribe();
            resolve(userOrNull ? userOrNull : null);
          });
        }
      });
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
  return query;
}
// En komponent som lyssnar på authentication förändringar tex vid inloggning och utloggning
export function AuthCacheListener() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const value = user ? user : null;
      queryClient.setQueryData(AUTH_KEY, value);
    });
    return () => unsubscribe();
  }, [queryClient]);
  return null;
}
