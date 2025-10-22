import { useAuthUser } from "@/auth";
import ChooseProfile from "@/components/household/chose-profile";
import { useAppTheme } from "@/constants/app-theme";
import { validateAndGetHousehold } from "@/src/services/householdService";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinHousehold() {
  const automaticCode = "89170R3BG3";
  const theme = useAppTheme();
  const { data: user } = useAuthUser();

  const [isSuccess, setIssuccess] = useState<boolean>(false);
  const [invitationCode, setInvitationCode] = useState(automaticCode);
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
            <View style={{ marginBottom: theme.custom.spacing.md }}>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurface }}
              >
                Inbjudningskod
              </Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="Ange inbjudningskod"
              value={invitationCode}
              onChangeText={setInvitationCode}
              style={{ backgroundColor: theme.colors.surface }}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <Button
              mode="contained"
              onPress={handleOnClick}
              style={{ marginTop: theme.custom.spacing.md }}
              disabled={invitationCode.length < 1}
              loading={query.isLoading}
            >
              Gå med i hushåll
            </Button>
            {error ? (
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.error,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {error}
              </Text>
            ) : null}
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
    marginBottom: 50,
  },
});
