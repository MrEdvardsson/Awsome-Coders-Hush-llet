import { useAuthUser } from "@/auth";
import { ChoreItem } from "@/components/chores/ChoreItem";
import { useAppTheme } from "@/constants/app-theme";
import { useChoresActions } from "@/hooks/useChoresActions";
import { getChores } from "@/src/data/chores";
import { getUserProfileForHousehold } from "@/src/data/household-db";
import { useQuery } from "@tanstack/react-query";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { FAB, Text } from "react-native-paper";

export default function HouseholdPage() {
  const theme = useAppTheme();
  const nav = useNavigation();
  const rootStack = nav.getParent()?.getParent();
  const { data: user } = useAuthUser();
  const swipeableRefs = React.useRef<Map<string, SwipeableMethods>>(new Map());

  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const {
    data: chores,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chores", householdId],
    queryFn: () => getChores(householdId),
    enabled: !!householdId,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", householdId, user?.uid],
    queryFn: () => getUserProfileForHousehold(householdId!, user!.uid),
    enabled: !!householdId && !!user?.uid,
  });

  const { completeMutation, handleDelete } = useChoresActions(
    householdId!,
    userProfile || undefined
  );

  useFocusEffect(
    useCallback(() => {
      rootStack?.setOptions({ headerShown: true });
      refetch();
      return () => rootStack?.setOptions({ headerShown: false });
    }, [rootStack, refetch])
  );

  const todayStart = React.useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        {isLoading && (
          <Text style={{ padding: 20, textAlign: "center", fontSize: 18 }}>
            Laddar...
          </Text>
        )}

        {error && (
          <View style={styles.centerContainer}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.error, textAlign: "center" }}
            >
              Något gick fel vid hämtning.
            </Text>
          </View>
        )}

        {!isLoading && !error && (
          <>
            <FlatList
              data={chores}
              keyExtractor={(item) => item.id!}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text variant="displaySmall" style={{ textAlign: "center" }}>
                    🧹
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={{
                      textAlign: "center",
                      marginTop: 16,
                      color: theme.colors.onSurface,
                    }}
                  >
                    Inga sysslor ännu
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{
                      textAlign: "center",
                      marginTop: 8,
                      color: theme.colors.onSurfaceVariant,
                    }}
                  >
                    Lägg till en syssla för att komma igång
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <ChoreItem
                  ref={(ref) => {
                    if (ref) {
                      swipeableRefs.current.set(item.id!, ref);
                    } else {
                      swipeableRefs.current.delete(item.id!);
                    }
                  }}
                  item={item}
                  theme={theme}
                  todayStart={todayStart}
                  userProfile={userProfile}
                  completeMutation={completeMutation}
                  handleDelete={handleDelete}
                  householdId={householdId}
                />
              )}
            />
            <FAB
              icon="plus"
              style={{ position: "absolute", margin: 24, right: 8, bottom: 8 }}
              onPress={() =>
                router.push({
                  pathname: "/screens/household/chores/add-chore",
                  params: { householdId },
                })
              }
            />
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
});
