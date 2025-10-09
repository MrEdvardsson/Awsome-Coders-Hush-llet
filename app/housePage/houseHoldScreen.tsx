import { useAppTheme } from "@/constants/app-theme";
import React from "react";
import { FlatList, View } from "react-native";
import { List, Text } from "react-native-paper";

export default function houseHoldScreen() {
  const theme = useAppTheme();

  const households = [
    {
      id: "1",
      name: "Familjen Andersson",
      generatedCode: "ABC123",
    },
    {
      id: "2",
      name: "Familjen Toblin",
      generatedCode: "XYZ789",
    },
  ];

  console.log("Nu är du i household");

  if (!households?.length) {
    return <Text style={{ margin: 20 }}>Du har inga hushåll ännu.</Text>;
  }

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Kod: ${item.generatedCode}`}
            left={(props) => <List.Icon {...props} icon="home" />}
            onPress={() => console.log("Öppnade hushåll:", item.name)}
          />
        )}
      />
    </View>
  );
}
