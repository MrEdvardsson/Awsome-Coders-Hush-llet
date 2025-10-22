import { useAppTheme } from "@/constants/app-theme";
import { Chore, updateChore } from "@/src/data/chores";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Surface, Text, TextInput } from "react-native-paper";

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
  const [choreFrequency, setChoreFrequency] = useState(
    Number(frequencyDays) || 7
  );
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
        params: { householdId },
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
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

        <Surface style={styles.section} elevation={0}>
          <Text variant="titleMedium" style={styles.sectionLabel}>
            Återkommande (dagar):
          </Text>
          <View style={styles.chipContainer}>
            {daysOptions.slice(0, 15).map((dayInterval) => (
              <Chip
                key={dayInterval}
                selected={choreFrequency === dayInterval}
                onPress={() => setChoreFrequency(dayInterval)}
                style={styles.chip}
                mode={choreFrequency === dayInterval ? "flat" : "outlined"}
              >
                {dayInterval}
              </Chip>
            ))}
          </View>
        </Surface>

        <Surface style={styles.section} elevation={0}>
          <Text variant="titleMedium" style={styles.sectionLabel}>
            Värde
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}
          >
            Hur energikrävande är sysslan?
          </Text>
          <View style={styles.chipContainer}>
            {valueOptions.map((v) => (
              <Chip
                key={v}
                selected={choreWeight === v}
                onPress={() => setChoreWeight(v)}
                style={styles.chip}
                mode={choreWeight === v ? "flat" : "outlined"}
              >
                {v}
              </Chip>
            ))}
          </View>
        </Surface>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          {mutation.isPending ? "Sparar..." : "Uppdatera syssla"}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionLabel: {
    fontWeight: "600",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});
