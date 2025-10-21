import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAppTheme } from "@/constants/app-theme";
import { Text, TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { updateChore } from "@/src/data/chores";
import { Chore } from "@/src/data/chores";

export default function EditChore() {
  const theme = useAppTheme();
  const { householdId, id, title, description, frequencyDays, weight } =
    useLocalSearchParams<{
      householdId: string;
      id: string;
      title: string;
      description: string;
      frequencyDays: string;
      weight: string;
    }>();

  const [choreTitle, setChoreTitle] = useState(title || "");
  const [choreDescription, setChoreDescription] = useState(description || "");
  const [choreFrequency, setChoreFrequency] = useState(Number(frequencyDays) || 7);
  const [choreWeight, setChoreWeight] = useState(Number(weight) || 4);

  const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);
  const valueOptions = [1, 2, 4, 6, 8, 10];

  const mutation = useMutation({
    mutationFn: async () =>
      await updateChore(householdId!, id!, {
        title: choreTitle,
        description: choreDescription,
        frequencyDays: choreFrequency,
        weight: choreWeight,
      } as Partial<Chore>),
    onSuccess: () => {
      Alert.alert("Sysslan har uppdaterats.");
      router.replace({
        pathname: "/screens/household/chores",
        params: { householdId},
      });
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Fel", "Något gick fel när sysslan skulle uppdateras.");
    },
  });

  const handleSave = () => {
    if (!choreTitle.trim() || !choreDescription.trim()) {
      Alert.alert("Fel", "Titel och beskrivning måste fyllas i.");
      return;
    }
    mutation.mutate();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.header}>Redigera syssla</Text>

      <TextInput
        label="Titel"
        value={choreTitle}
        onChangeText={setChoreTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Beskrivning"
        value={choreDescription}
        onChangeText={setChoreDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 120 }]}
      />

      <Text style={styles.sectionLabel}>Återkommande (dagar):</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {daysOptions.map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.optionCircle,
              {
                backgroundColor:
                  choreFrequency === d ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setChoreFrequency(d)}
          >
            <Text
              style={{
                color: choreFrequency === d ? theme.colors.background : theme.colors.onTertiary,
                fontWeight: "600",
              }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>Värde</Text>
      <Text>Hur energikrävande är sysslan?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {valueOptions.map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.optionCircle,
              {
                backgroundColor:
                  choreWeight === v ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setChoreWeight(v)}
          >
            <Text
              style={{
                color: choreWeight === v ? theme.colors.background : theme.colors.onTertiary,
                fontWeight: "600",
              }}
            >
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={mutation.isPending}
        disabled={mutation.isPending}
        style={{ marginTop: 30 }}
      >
        {mutation.isPending ? "Sparar..." : "Uppdatera syssla"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  carouselContainer: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  optionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
});
