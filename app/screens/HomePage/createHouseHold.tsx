import { useAppTheme } from "@/constants/app-theme";
import generateCode from "@/utils/generateCode";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function createHouseHold() {
  const theme = useAppTheme();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  const handleGenerateCode = () => {
    const newCode = generateCode();
    setCode(newCode);
  };

  console.log("Hej create Household!!");
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <Text
        variant="headlineSmall"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Skapa Hushåll
      </Text>
      <View style={styles.form}>
        <Surface
          style={[styles.card, { backgroundColor: theme.custom.cardBg }]}
        >
          <TextInput
            style={{ borderColor: "none" }}
            label="Titel"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
          ></TextInput>
        </Surface>
        <Surface
          style={[styles.card, { backgroundColor: theme.custom.cardBg }]}
        >
          <TextInput
            label="Kod:"
            value={code}
            onChangeText={setCode}
            multiline
            numberOfLines={3}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleGenerateCode}
            style={{ marginTop: 12 }}
          >
            Generera Kod
          </Button>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
});
