import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { GetHousehold, ListenToHouseholds } from "@/src/data/household-db";
// import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, FAB, IconButton, Text } from "react-native-paper";

export default function Home() {
  const theme = useAppTheme();
  const { data: user } = useAuthUser();
  const [households, setHouseholds] = useState<GetHousehold[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = ListenToHouseholds(user.uid, (householdsFromDb) => {
      setHouseholds(householdsFromDb);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInfoButton = (household: any) => {
    router.push({
      pathname: "/screens/home/info-household",
      params: { data: JSON.stringify(household) },
    });
  };

  if (loading) return <Text>Laddar...</Text>;
  if (households.length === 0) {
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={households}
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
            style={styles.householdCard}
            mode="elevated"
            elevation={2}
            onPress={() =>
              router.push({
                pathname: "/screens/household/chores",
                params: { householdId: item.id },
              })
            }
          >
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
