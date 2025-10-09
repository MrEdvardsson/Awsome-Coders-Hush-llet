import { useAppTheme } from "@/constants/app-theme";
import React from "react";
import { FlatList, View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { mockHouseholds } from "./mockData";

export default function houseHoldScreen() {
  const theme = useAppTheme();

  console.log("Nu är du i household");

  if (!mockHouseholds?.length) {
    return <Text style={{ margin: 20 }}>Du har inga hushåll ännu.</Text>;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingTop: 20,
      }}
    >
      <View style={{ flex: 8 }}>
        <FlatList
          style={{ height: "75%" }}
          data={mockHouseholds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={{ margin: 10, borderRadius: 15 }}
              onPress={() => console.log("Öppnade hushåll:", item.name)}
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
          onPress={() => console.log("Nu ska du lägga till ett hem!")}
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
          onPress={() => console.log("Nu ska du joina ett hem!")}
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
    </View>
  );
}
