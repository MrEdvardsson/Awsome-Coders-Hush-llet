import { useAppTheme } from "@/constants/app-theme";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";

type mockChore = {
  id: string;
  title: string;
  description: string;
  frequencyDays: number;
  weight: number;
  imageUrl?: string;
  audioUrl?: string;
  isArchived: boolean;
  assignedTo?: string; // Profile
};

const mockChores: mockChore[] = [
  {
    id: "1",
    title: "Damma av",
    description: "Damma av alla ytor i vardagsrummet.",
    frequencyDays: 7,
    weight: 4,
    isArchived: false,
    assignedTo: "user1",
  },
  {
    id: "2",
    title: "Dammsuga",
    description: "Dammsuga hela huset.",
    frequencyDays: 10,
    weight: 6,
    isArchived: false,
    assignedTo: "user2",
  },
  {
    id: "3",
    title: "Moppa golven",
    description: "Moppa alla golv i huset.",
    frequencyDays: 14,
    weight: 10,
    isArchived: false
  },
];

export default function HouseholdPage() {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 30 }}>
      <FlatList
        data={mockChores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/screens/household/chores/chore-details",
                params: {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  frequencyDays: item.frequencyDays.toString(),
                  weight: item.weight.toString(),
                  assignedTo: item.assignedTo,
                },
              })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.titleText}>{item.title}</Text>

              <View style={styles.daysCircle}>
                <Text style={styles.daysText}>{item.frequencyDays}</Text>
              </View>
            </View>
          </Card>
        )}
      />

      
      <TouchableOpacity
      //TODO ska bara visas om man är admin för hushållet
        style={[
          styles.floatingButton,
          { backgroundColor: theme.colors.secondary },
        ]}
        onPress={() => router.push("/screens/household/chores/add-chore")}
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
    width: 34,
    height: 34,
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
    backgroundColor: "#2563eb",
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
