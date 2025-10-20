import { useAppTheme } from "@/constants/app-theme";
import { getChores } from "@/src/data/chores";
import { useQuery } from "@tanstack/react-query";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function HouseholdPage() {
  const theme = useAppTheme();
  const nav = useNavigation();
  const rootStack = nav.getParent()?.getParent();

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

  useFocusEffect(
    useCallback(() => {
      rootStack?.setOptions({ headerShown: true });
      refetch();
      return () => rootStack?.setOptions({ headerShown: false });
    }, [rootStack, refetch])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 30,
      }}
    >
      {isLoading && (
        <Text style={{ padding: 20, textAlign: "center", fontSize: 18 }}>
          Laddar...
        </Text>
      )}

      {error && (
        <Text
          style={{
            padding: 20,
            textAlign: "center",
            fontSize: 18,
            color: theme.colors.error,
          }}
        >
          Något gick fel vid hämtning.
        </Text>
      )}

      {!isLoading && !error && (
        <FlatList
          data={chores}
          keyExtractor={(item) => item.id!}
          ListEmptyComponent={
            <Text
              style={{
                padding: 20,
                textAlign: "center",
                fontSize: 30,
              }}
            >
              Inga sysslor ännu 🧹
            </Text>
          }
          renderItem={({ item }) => {
            const isOverdue =
              item.daysSinceCompleted !== null &&
              item.daysSinceCompleted !== undefined &&
              item.daysSinceCompleted > item.frequencyDays;

            return (
              <Card
                style={styles.card}
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
                <View style={styles.cardContent}>
                  <Text style={styles.titleText}>{item.title}</Text>

                  <View
                    style={[
                      styles.daysCircle,
                      isOverdue && {
                        backgroundColor: theme.colors.error,
                        borderColor: theme.colors.error,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.daysText,
                        isOverdue && { color: theme.colors.onError },
                      ]}
                    >
                      {item.daysSinceCompleted ?? 0}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor: theme.colors.secondary },
        ]}
        onPress={() =>
          router.push({
            pathname: "/screens/household/chores/add-chore",
            params: { householdId },
          })
        }
        activeOpacity={0.8}
      >
        <Text style={styles.plusText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 2,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  daysCircle: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#e6e8ebff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  daysText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  floatingButton: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  plusText: {
    color: "white",
    fontSize: 38,
    marginTop: -2,
  },
});
