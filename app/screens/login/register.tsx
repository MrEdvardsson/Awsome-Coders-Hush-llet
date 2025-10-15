import { useAppTheme } from "@/constants/app-theme";
import { registerHandler } from "@/src/services/registerService";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function Register() {
  const theme = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    const result = await registerHandler(email, password, confirmPassword);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Registrering lyckad!',
        text2: 'Ditt konto har skapats och du loggas nu in..',
        visibilityTime: 3000,
        onHide: () => {
          router.replace("/screens/home");
        }
      });
    } else {
      setError(result.error!);
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/n4.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="displayMedium" style={styles.title}>
                Skapa konto
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Fyll i din e-post och välj lösenord
              </Text>
            </View>
            <Surface
              style={[
                styles.formContainer,
                { backgroundColor: theme.colors.surface },
              ]}
              elevation={4}
            >
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Lösenord"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                left={<TextInput.Icon icon="lock" />}
              />
              <TextInput
                label="Bekräfta lösenord"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                left={<TextInput.Icon icon="lock" />}
              />
              {error && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
              >
                Skapa konto
              </Button>
            </Surface>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
  },
});
