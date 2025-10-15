import { useAppTheme } from "@/constants/app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = ["🦊", "🐷", "🐸", "🐤", "🐙", "🐋", "🦉", "🦄"];

export default function JoinHousehold() {
  const theme = useAppTheme();

  const [profileName, setProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [invitationCode, setInvitationCode] = useState("");

  const handleJoinHousehold = () => {
    if (!profileName.trim() || !selectedAvatar || !invitationCode.trim()) {
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* <View
        style={[styles.header, { borderBottomColor: theme.colors.outline }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          Gå med i hushåll
        </Text>
      </View> */}

      <ScrollView style={styles.content}>
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

        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Inbjudningskod
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Ange inbjudningskod"
            value={invitationCode}
            onChangeText={setInvitationCode}
            style={{ backgroundColor: theme.colors.surface }}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurface,
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Efter att du har tryckt på gått med så behöver en administratör i
            hushållet acceptera din ansökan
          </Text>
        </View>
      </ScrollView>
      <View style={styles.joinButton}>
        <Button
          mode="contained"
          onPress={handleJoinHousehold}
          disabled={
            !profileName.trim() || !selectedAvatar || !invitationCode.trim()
          }
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Gå med
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
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
