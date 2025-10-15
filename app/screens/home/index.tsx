import { useAppTheme } from "@/constants/app-theme";
// import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { mockHouseholds } from "../../../src/data/mockdata";

export default function Home() {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
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

  if (!mockHouseholds?.length) {
    return <Text style={{ margin: 20 }}>Du har inga hushåll ännu.</Text>;
  }
  console.log("Nu är du i household");

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatlist}
          data={mockHouseholds} // Mockdata, här ska den inloggade personens hushåll läsas
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={styles.householdCard}
              onPress={() => router.push("/screens/household/chores")}
            >
              <Card.Title
                title={item.name}
                subtitle={`Kod: ${item.generatedCode}`}
                left={() => (
                  <Ionicons
                    name="home"
                    size={24}
                    color={theme.colors.onBackground}
                  />
                )}
                right={() => (
                  <TouchableOpacity
                    onPress={() => router.push("/screens/home/info-household")}
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

//    TODO: Skapa en hook "Hooks/useHouseHolds.ts" där man hämtar användarens hushåll
//------------------------------------------------------------------------------------
// const auth = getAuth();
// const user = auth.currentUser;
// const { households, loading, error } = useHouseholds(user?.uid);
// if (loading) return <Text style={{ margin: 20 }}>Laddar hushåll...</Text>;
// if (error) return <Text style={{ margin: 20, color: "red" }}>{error}</Text>;
//------------------------------------------------------------------------------------
