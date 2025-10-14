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
  assignedTo: string; // Profile
};

const mockChores: mockChore[] = [
  {
    id: "1",
    title: "Damma av",
    description: "Damma av alla ytor i vardagsrummet.",
    frequencyDays: 7,
    weight: 3,
    isArchived: false,
    assignedTo: "user1",
  },
  {
    id: "2",
    title: "Dammsuga",
    description: "Dammsuga hela huset.",
    frequencyDays: 10,
    weight: 5,
    isArchived: false,
    assignedTo: "user2",
  },
  {
    id: "3",
    title: "Moppa golven",
    description: "Moppa alla golv i huset.",
    frequencyDays: 14,
    weight: 20,
    isArchived: false,
    assignedTo: "user3",
  },
];

export default function HouseholdPage() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 30,
      }}
    >
      <FlatList
        data={mockChores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              router.push("/screens/household/chores/chore-details")
            }
          >
            <Card.Title
              title={item.title}
              right={() => (
                <View style={styles.daysCircle}>
                  <Text style={styles.daysText}>{item.frequencyDays}</Text>
                </View>
              )}
            />
          </Card>
        )}
      />

      <TouchableOpacity
        style={styles.floatingButton}
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
  },
  daysCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#e6e8ebff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#e6e8ebff"
  },
  daysText: {
    fontSize: 16,
    fontWeight: "600",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30, 
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2563eb", 
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
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