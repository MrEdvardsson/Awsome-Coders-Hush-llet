import { useAppTheme } from "@/constants/app-theme";
import { GetHousehold } from "@/src/data/household-db";
import {
  getAvailableAvatars,
  handleJoinHousehold,
  validateJoinHouseholdInput,
} from "@/src/services/householdService";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
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
import Success from "../success";
interface Props {
  invitationCode: string;
  houseHould: GetHousehold;
  userId: string;
}

export default function ChooseProfile({
  invitationCode,
  houseHould,
  userId,
}: Props) {
  const theme = useAppTheme();
  const joinHouseholdMutation = useMutation({
    mutationFn: async () =>
      handleJoinHousehold(houseHould, userId, {
        profileName: profileName,
        selectedAvatar: selectedAvatar,
      }),
    onSuccess: () => {
      setErrorMessage("");
      setJoinHouseholdSuccess(true);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
  const [profileName, setProfileName] = useState("");
  const avatars = getAvailableAvatars(houseHould);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [joinHouseholdSuccess, setJoinHouseholdSuccess] = useState(false);

  function handleSubmit() {
    setErrorMessage("");
    const validationResult = validateJoinHouseholdInput(
      profileName,
      selectedAvatar,
      houseHould
    );
    if (validationResult) {
      setErrorMessage(validationResult);
    } else {
      joinHouseholdMutation.mutate();
    }
  }
  if (!joinHouseholdSuccess) {
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
            <Text
              variant="headlineMedium"
              style={{ paddingBottom: theme.custom.spacing.lg }}
            >
              {houseHould.title}
            </Text>
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
            {errorMessage ? (
              <Text
                style={{
                  color: theme.colors.error,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {errorMessage}
              </Text>
            ) : null}
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
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit();
              }}
              disabled={
                profileName.length < 1 ||
                !selectedAvatar ||
                joinHouseholdMutation.isPending ||
                joinHouseholdMutation.isSuccess
              }
              loading={joinHouseholdMutation.isPending}
            >
              Gå med i {houseHould.title}
            </Button>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                opacity: 0.7,
                textAlign: "center",
                marginTop: theme.custom.spacing.sm,
              }}
            >
              Efter att du har tryckt på gått med så behöver en administratör i
              hushållet acceptera din ansökan
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  if (joinHouseholdSuccess)
    return (
      <Success
        title={"Nästan där!"}
        onButtonPress={() => {
          router.replace("/screens/home");
        }}
        buttonText="Gå tillbaka till dina hushåll"
        message={`Du har begärt medlemskap i ${houseHould.title}. Vänta på godkännande från hushållets administratör.`}
      />
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
  },
  avatarButton: {
    width: "25%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    margin: 1,
  },
});
