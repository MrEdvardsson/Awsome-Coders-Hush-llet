import { useAppTheme } from "@/constants/app-theme";
import { getLoginError, signInUser, validateLogin } from "@/src/services/loginService";
import { useMutation } from "@tanstack/react-query";
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
import { automaticEmail } from "../../../firebase-config";

//Logga in sidan
export default function Login() {
  const theme = useAppTheme();
  const [email, setEmail] = useState(automaticEmail.email);
  const [password, setPassword] = useState(automaticEmail.password);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      setError(null);
      router.replace("/screens/home");
    },
    onError: (error: any) => {
      const errorMessage = error?.code ? getLoginError(error.code) : "Ett fel uppstod vid inloggning";
      setError(errorMessage);
    }
  });

  const handleLogin = () => {
    setError(null);

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    mutation.mutate({ email, password });
  }

  const handleRegister = () => {
    router.push("/screens/login/register");
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
                Hushållet
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Logga in eller registrera konto
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
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    onSurface: theme.colors.onSurface,
                  },
                }}
              />
              <TextInput
                label="Lösenord"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                left={<TextInput.Icon icon="lock" />}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    onSurface: theme.colors.onSurface,
                  },
                }}
              />
              {error && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={mutation.isPending}
                disabled={mutation.isPending}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Logga in
              </Button>
              <Button
                mode="outlined"
                onPress={handleRegister}
                loading={mutation.isPending}
                disabled={mutation.isPending}
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
  loginButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  registerButton: {
    marginBottom: 8,
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
