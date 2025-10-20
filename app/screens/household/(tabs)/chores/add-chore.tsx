import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAppTheme } from "@/constants/app-theme";
import { Text, TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { addChore } from "@/src/data/chores";

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.header}>Lägg till syssla</Text>

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
                  frequencyDays === d ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setFrequencyDays(d)}
          >
            <Text
              style={{
                color:
                  frequencyDays === d ? theme.colors.background : theme.colors.onTertiary,
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
                  value === v ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setValue(v)}
          >
            <Text
              style={{
                color: value === v ? theme.colors.background : theme.colors.onTertiary,
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
        {mutation.isPending ? "Sparar..." : "Spara syssla"}
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
