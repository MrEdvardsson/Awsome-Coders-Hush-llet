import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
// import { getAuth } from "firebase/auth";
import { GetHouseholds } from "@/src/data/household-db";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, List, Text } from "react-native-paper";

export default function Home() {
  const theme = useAppTheme();
  const { data: user } = useAuthUser();
  let householdsInDb = true;

  const {
    data: households,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["households", user?.uid],
    queryFn: () => GetHouseholds(user!.uid),
    enabled: !!user,
  });

  if (isLoading) return <Text>Laddar...</Text>;
  if (!households?.length) {
    householdsInDb = false;
  }
  console.log("Nu är du i household");

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.listContainer}>
        {householdsInDb && (
          <FlatList
            style={styles.flatlist}
            data={households}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                style={styles.householdCard}
                onPress={() => 
                  router.push({ 
                  pathname: "/screens/household/chores",
                  params: { householdId: item.id },
                })
              }
              >
                <Card.Title
                  title={item.title}
                  subtitle={`Kod: ${item.code}`}
                  left={() => (
                    <Ionicons
                      name="home"
                      size={24}
                      color={theme.colors.onBackground}
                    />
                  )}
                  right={() => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/screens/home/info-household")
                      }
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color={theme.colors.onBackground}
                        style={{ paddingRight: 12 }}
                      />
                    </TouchableOpacity>
                  )}
                />
              </Card>
            )}
          />
        )}
        {!households && <Text variant="displayLarge">Du har inga hushåll</Text>}
      </View>
      <View style={styles.footer}>
        <Card
          style={styles.footerCard}
          onPress={() => router.push("/screens/home/create-household")}
        >
          <Card.Content style={styles.footerCardContent}>
            <Text variant="titleMedium">Lägg till</Text>
            <List.Icon icon="plus" />
          </Card.Content>
        </Card>
        <Card
          style={{
            margin: 10,
            borderRadius: 25,
            width: "40%",
          }}
          onPress={() => router.push("/screens/home/join-household")}
        >
          <Card.Content style={styles.footerCardContent}>
            <Text variant="titleMedium">Gå med </Text>
            <List.Icon icon="plus" />
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 20,
  },
  listContainer: {
    flex: 8,
  },
  flatlist: {
    height: "75%",
  },
  householdCard: {
    margin: 10,
    borderRadius: 15,
  },
  footer: {
    flex: 1,
    padding: 10,
    backgroundColor: "grey",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCard: {
    margin: 10,
    borderRadius: 25,
    width: "40%",
  },
  footerCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 12,
  },
});
