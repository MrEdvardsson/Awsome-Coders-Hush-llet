import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { AddHousehold } from "@/src/data/household-db";
import generateCode from "@/utils/generateCode";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = ["🦊", "🐷", "🐸", "🐤", "🐙", "🐋", "🦉", "🦄"];

export default function CreateHousehold() {
  const theme = useAppTheme();

  const { data: user } = useAuthUser();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  const handleGenerateCode = () => {
    const newCode = generateCode();
    console.log("Genererar kod! " + newCode);
    setCode(newCode);
  };

  const handleSaveButton = async () => {
    console.log("du tryckte på spara!");
    if (
      !profileName.trim() ||
      !selectedAvatar ||
      !title.trim() ||
      !code.trim()
    ) {
      return;
    }

    if (!user?.uid) {
      alert("Ingen användare inloggad!");
      return;
    }

    setLoading(true);
    try {
      await AddHousehold(
        user!.uid,
        { title, code },
        { profileName, selectedAvatar }
      );
      alert("✅ Hushållet sparades i Firebase!");
      setTitle("");
      setCode("");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Titel
          </Text>
          <TextInput
            label="Ange titel:"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={{ backgroundColor: theme.colors.surface }}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          ></TextInput>
        </View>
        <View style={styles.section}>
          <TextInput
            label="Kod:"
            value={code}
            onChangeText={setCode}
            multiline
            numberOfLines={3}
            mode="outlined"
            style={{ backgroundColor: theme.colors.surface, marginTop: 12 }}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <Button
            mode="contained"
            onPress={handleGenerateCode}
            style={{ marginTop: 12, marginBottom: 50 }}
          >
            Generera Kod
          </Button>
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Profilnamn
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Ange ditt namn"
            value={profileName}
            onChangeText={setProfileName}
            style={{ backgroundColor: theme.colors.surface }}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Välj avatar
          </Text>
          <View style={styles.avatarGrid}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarButton,
                  {
                    backgroundColor:
                      selectedAvatar === avatar
                        ? theme.colors.primary + "20"
                        : theme.colors.surface,
                    borderColor:
                      selectedAvatar === avatar
                        ? theme.colors.primary
                        : "transparent",
                  },
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Text variant={"titleLarge"}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.joinButton}>
        <Button
          mode="contained"
          onPress={handleSaveButton}
          disabled={
            !profileName.trim() ||
            !selectedAvatar ||
            !title.trim() ||
            !code.trim()
          }
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Spara
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
  },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 8,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  avatarButton: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  joinButton: {
    marginTop: 32,
    marginBottom: 32,
    marginHorizontal: 16,
  },
});
