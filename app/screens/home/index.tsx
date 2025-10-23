import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { UserExtends } from "@/src/data/household-db";
// import { getAuth } from "firebase/auth";
import { db } from "@/firebase-config";
import { validateHouseholdMembership } from "@/src/services/householdService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, FAB, IconButton, Text } from "react-native-paper";
import { Household } from "./info-household";

export default function Home() {
  const theme = useAppTheme();
  const { data: user } = useAuthUser();
  const [fabOpen, setFabOpen] = useState(false);

  const {
    data: households,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user_extend", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const ref = doc(db, "user_extend", user!.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return []; // Return empty array for new users
      const data = snap.data() as UserExtends;
      return await validateHouseholdMembership(data);
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 2,
  });

  const handleInfoButton = (household: Household) => {
    router.push({
      pathname: "/screens/home/info-household",
      params: { data: JSON.stringify(household) },
    });
  };

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyContainer}>
          <Text>Laddar...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.error }}>
            Fel: {(error as Error).message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={households || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="home-outline"
              size={64}
              color={theme.colors.outline}
            />
            <Text
              variant="headlineSmall"
              style={{
                textAlign: "center",
                marginTop: 16,
                color: theme.colors.onSurface,
              }}
            >
              Inga hushåll ännu
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                textAlign: "center",
                marginTop: 8,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Skapa ett nytt eller gå med i ett befintligt
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            style={[
              styles.householdCard,
              item.userProfile.isPaused && {
                opacity: 0.5,
                backgroundColor: "#00000010",
              },
            ]}
            mode="elevated"
            elevation={2}
            onPress={() =>
              router.push({
                pathname: "/screens/household/chores",
                params: { householdId: item.id },
              })
            }
          >
            {item.userProfile?.isPaused && (
              <Card.Content>
                <Text
                  style={{
                    color: "#fffefeff",
                    fontStyle: "italic",
                    marginTop: 4,
                  }}
                >
                  Pausad
                </Text>
              </Card.Content>
            )}
            <Card.Title
              title={item.title}
              titleVariant="titleLarge"
              subtitle={`Kod: ${item.code}`}
              subtitleVariant="bodyMedium"
              left={(props) => (
                <Ionicons
                  name="home"
                  size={28}
                  color={theme.colors.primary}
                  style={{ marginLeft: 8 }}
                />
              )}
              right={(props) => (
                <IconButton
                  icon="information-outline"
                  size={24}
                  onPress={() => handleInfoButton(item)}
                />
              )}
            />
          </Card>
        )}
      />

      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? "close" : "plus"}
        actions={[
          {
            icon: "home-plus",
            label: "Skapa hushåll",
            onPress: () => router.push("/screens/home/create-household"),
          },
          {
            icon: "account-multiple-plus",
            label: "Gå med i hushåll",
            onPress: () => router.push("/screens/home/join-household"),
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        style={{ position: "absolute", margin: 24, right: 8, bottom: 8 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  householdCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
});
