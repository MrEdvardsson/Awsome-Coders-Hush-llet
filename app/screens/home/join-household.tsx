import { useAuthUser } from "@/auth";
import ChooseProfile from "@/components/household/chose-profile";
import { useAppTheme } from "@/constants/app-theme";
import { validateAndGetHousehold } from "@/src/services/householdService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinHousehold() {
  const theme = useAppTheme();
  const { data: user } = useAuthUser();

  const [isSuccess, setIssuccess] = useState<boolean>(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState<string | undefined>("");

  const query = useQuery({
    queryKey: ["invitationCode", invitationCode],
    queryFn: () => validateAndGetHousehold(invitationCode, user!.uid),
    enabled: false,
  });

  async function handleOnClick() {
    setError(undefined);
    const result = await query.refetch();
    if (!result.data?.isSuccess) setError(result.data?.errorMessage);
    if (result.data?.isSuccess) setIssuccess(true);
  }

  if (!isSuccess)
    return (
      <SafeAreaView
        style={[style.container, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView
          style={style.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={style.content}>
            <Surface style={style.card} elevation={2}>
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Ionicons
                  name="home-outline"
                  size={64}
                  color={theme.colors.primary}
                />
                <Text
                  variant="headlineSmall"
                  style={{ marginTop: 16, fontWeight: "600" }}
                >
                  Gå med i hushåll
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    marginTop: 8,
                    color: theme.colors.onSurfaceVariant,
                    textAlign: "center",
                  }}
                >
                  Ange inbjudningskoden du fått från hushållets ägare
                </Text>
              </View>

              <TextInput
                mode="outlined"
                label="Inbjudningskod"
                placeholder="Ange kod"
                value={invitationCode}
                onChangeText={setInvitationCode}
                style={{
                  backgroundColor: theme.colors.surface,
                  marginBottom: 16,
                }}
                left={<TextInput.Icon icon="key-outline" />}
              />

              <Button
                mode="contained"
                onPress={handleOnClick}
                disabled={invitationCode.length < 5}
                loading={query.isLoading}
                contentStyle={{ paddingVertical: 8 }}
              >
                {query.isLoading ? "Kontrollerar..." : "Gå med"}
              </Button>

              {error && (
                <Surface
                  style={{
                    marginTop: 16,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: theme.colors.errorContainer,
                  }}
                  elevation={0}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.error, textAlign: "center" }}
                  >
                    {error}
                  </Text>
                </Surface>
              )}
            </Surface>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  if (isSuccess)
    return (
      <ChooseProfile
        invitationCode={invitationCode}
        houseHould={query.data?.houseHold!}
        userId={user!.uid}
      />
    );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 24,
    borderRadius: 16,
  },
});
