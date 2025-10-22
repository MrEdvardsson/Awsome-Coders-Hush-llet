import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { getChores, markChoreCompleted } from "@/src/data/chores";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback } from "react";
import { Alert, Animated, FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Card, FAB, Surface, Text } from "react-native-paper";

export default function HouseholdPage() {
  const theme = useAppTheme();
  const nav = useNavigation();
  const rootStack = nav.getParent()?.getParent();
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();

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

  // Mutation för att markera syssla som klar
  const completeMutation = useMutation({
    mutationFn: async (choreId: string) => {
      // TODO: Vi behöver profileId här - för nu använder vi user.uid
      // Det är inte perfekt men funkar tills vi har en profilväljare
      if (!user?.uid) throw new Error("Ingen användare inloggad");
      await markChoreCompleted(householdId!, choreId, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores", householdId] });
      Alert.alert("Bra jobbat!", "Sysslan är markerad som klar! 🎉");
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Fel", "Kunde inte markera sysslan som klar.");
    },
  });

  useFocusEffect(
    useCallback(() => {
      rootStack?.setOptions({ headerShown: true });
      refetch();
      return () => rootStack?.setOptions({ headerShown: false });
    }, [rootStack, refetch])
  );

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
              renderItem={({ item }) => {
                const isOverdue =
                  item.daysSinceCompleted !== null &&
                  item.daysSinceCompleted !== undefined &&
                  item.daysSinceCompleted > item.frequencyDays;

                const renderRightActions = (
                  progress: Animated.AnimatedInterpolation<number>,
                  dragX: Animated.AnimatedInterpolation<number>
                ) => {
                  const scale = dragX.interpolate({
                    inputRange: [-100, 0],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  });

                  return (
                    <View style={styles.swipeActionContainer}>
                      <Animated.View
                        style={[
                          styles.completeAction,
                          {
                            backgroundColor: theme.colors.primary,
                            transform: [{ scale }],
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: theme.colors.onPrimary,
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          ✓ Klar
                        </Text>
                      </Animated.View>
                    </View>
                  );
                };

                return (
                  <Swipeable
                    renderRightActions={renderRightActions}
                    onSwipeableOpen={(direction) => {
                      if (direction === "right") {
                        completeMutation.mutate(item.id!);
                      }
                    }}
                    overshootRight={false}
                  >
                    <Card
                      style={styles.card}
                      mode="elevated"
                      elevation={2}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/household/chores/chore-details",
                          params: {
                            householdId,
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            frequencyDays: item.frequencyDays.toString(),
                            weight: item.weight.toString(),
                            assignedTo: item.assignedTo ?? "",
                            daysSinceCompleted:
                              item.daysSinceCompleted?.toString() ?? "0",
                          },
                        })
                      }
                    >
                      <Card.Content>
                        <View style={styles.cardContent}>
                          <View style={{ flex: 1 }}>
                            <Text
                              variant="titleMedium"
                              style={styles.titleText}
                            >
                              {item.title}
                            </Text>
                            {item.description && (
                              <Text
                                variant="bodySmall"
                                numberOfLines={1}
                                style={{
                                  color: theme.colors.onSurfaceVariant,
                                  marginTop: 4,
                                }}
                              >
                                {item.description}
                              </Text>
                            )}
                          </View>

                          <Surface
                            style={[
                              styles.daysChip,
                              {
                                backgroundColor: isOverdue
                                  ? theme.colors.errorContainer
                                  : theme.colors.secondaryContainer,
                              },
                            ]}
                            elevation={0}
                          >
                            <Text
                              variant="labelLarge"
                              style={{
                                color: isOverdue
                                  ? theme.colors.error
                                  : theme.colors.onSecondaryContainer,
                                fontWeight: "bold",
                              }}
                            >
                              {item.daysSinceCompleted ?? 0}
                            </Text>
                          </Surface>
                        </View>
                      </Card.Content>
                    </Card>
                  </Swipeable>
                );
              }}
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
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleText: {
    fontWeight: "600",
  },
  daysChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: "center",
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
  swipeActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  completeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
