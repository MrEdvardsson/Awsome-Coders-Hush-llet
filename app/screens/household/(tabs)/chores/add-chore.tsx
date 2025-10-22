import { useAppTheme } from "@/constants/app-theme";
import { addChore } from "@/src/data/chores";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Surface, Text, TextInput } from "react-native-paper";

export default function AddChore() {
  const theme = useAppTheme();
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [value, setValue] = useState(4);

  const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);
  const valueOptions = [1, 2, 4, 6, 8, 10];

  const mutation = useMutation({
    mutationFn: async () =>
      await addChore(householdId!, {
        title,
        description,
        frequencyDays,
        weight: value,
        isArchived: false,
      }),
    onSuccess: () => {
      Alert.alert("Sysslan har lagts till.");
      router.back();
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Fel", "Något gick fel när sysslan skulle sparas.");
    },
  });

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
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
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Beskrivning"
          value={description}
          onChangeText={setDescription}
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
                selected={frequencyDays === dayInterval}
                onPress={() => setFrequencyDays(dayInterval)}
                style={styles.chip}
                mode={frequencyDays === dayInterval ? "flat" : "outlined"}
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
                selected={value === v}
                onPress={() => setValue(v)}
                style={styles.chip}
                mode={value === v ? "flat" : "outlined"}
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
          {mutation.isPending ? "Sparar..." : "Spara syssla"}
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
