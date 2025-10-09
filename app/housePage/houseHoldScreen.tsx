import React from "react";
import { FlatList } from "react-native";
import { List, Text } from "react-native-paper";

export default function houseHoldScreen() {
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

  if (!households?.length) {
    return <Text style={{ margin: 20 }}>Du har inga hushåll ännu.</Text>;
  }

  return (
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
  );
}
