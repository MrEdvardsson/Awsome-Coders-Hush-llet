import { useAppTheme } from "@/constants/app-theme";
// import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockHouseholds } from "../../../src/data/mockdata";

export default function HouseholdScreen() {
  const theme = useAppTheme();

  //    TODO: Skapa en hook "Hooks/useHouseHolds.ts" där man hämtar användarens hushåll
  //------------------------------------------------------------------------------------
  // const auth = getAuth();
  // const user = auth.currentUser;
  // const { households, loading, error } = useHouseholds(user?.uid);
  // if (loading) return <Text style={{ margin: 20 }}>Laddar hushåll...</Text>;
  // if (error) return <Text style={{ margin: 20, color: "red" }}>{error}</Text>;
  //------------------------------------------------------------------------------------

  if (!mockHouseholds?.length) {
    return <Text style={{ margin: 20 }}>Du har inga hushåll ännu.</Text>;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingTop: 20,
      }}
    >
      <View style={{ flex: 8 }}>
        <FlatList
          style={{ height: "75%" }}
          data={mockHouseholds} // Mockdata, här ska den inloggade personens hushåll läsas
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={{ margin: 10, borderRadius: 15 }}
              onPress={() => router.push("/screens/householdpage")}
            >
              <Card.Title
                title={item.name}
                subtitle={`Kod: ${item.generatedCode}`}
                left={(props) => <List.Icon {...props} icon="home" />}
              />
            </Card>
          )}
        />
      </View>
      <View
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: "grey",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            margin: 10,
            borderRadius: 25,
            width: "40%",
          }}
          onPress={() => console.log("Nu ska du lägga till ett hem!")} //Här ska en modal öppnas för fylla i de fält som krävs för att skapa nytt hushåll!
        >
          <Card.Content
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
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
          onPress={() => router.push("/screens/homepage/JoinHouseholdScreen")} //Här ska en modal öppnas för fylla i de fält som krävs för att gå med i ett hushåll!
        >
          <Card.Content
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text variant="titleMedium">Gå med </Text>
            <List.Icon icon="plus" />
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}
