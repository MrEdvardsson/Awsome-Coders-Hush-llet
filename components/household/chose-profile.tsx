import { useAppTheme } from "@/constants/app-theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseProfile() {
  const theme = useAppTheme();
  const [profileName, setProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const avatars = ["🦊", "🐷", "🐸", "🐤", "🐙", "🐋", "🦉", "🦄"];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
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
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
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
              <Text
                variant="bodySmall"
                style={{
                  color: theme.colors.onSurface,
                  opacity: 0.7,
                  textAlign: "center",
                }}
              >
                Ej klickbar avatar är redan tagen
              </Text>
            </View>
          </View>
          <Button mode="contained" onPress={() => {}}>
            Skicka förfrågan
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 8,
  },
  content: {
    padding: 24,
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
});
