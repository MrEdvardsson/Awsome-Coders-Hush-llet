import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/constants/app-theme";
import { Text, TextInput, Button } from "react-native-paper";

export default function AddChore() {
  const theme = useAppTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [value, setValue] = useState(4);

  const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);
  const valueOptions = [1, 2, 4, 6, 8, 10];

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

      <Text style={styles.sectionLabel}>Återkommande:</Text>
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
                backgroundColor: frequencyDays === d ? "#2563eb" : "#f1f5f9",
              },
            ]}
            onPress={() => setFrequencyDays(d)}
          >
            <Text
              style={{
                color: frequencyDays === d ? "white" : "#1e293b",
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
                backgroundColor: value === v ? "#2563eb" : "#f1f5f9",
              },
            ]}
            onPress={() => setValue(v)}
          >
            <Text
              style={{
                color: value === v ? "white" : "#1e293b",
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
        onPress={() =>
          console.log({
            title,
            description,
            frequencyDays,
            value,
          })
        }
        style={{ marginTop: 30 }}
      >
        Spara syssla
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
