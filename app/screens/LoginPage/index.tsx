import { useAppTheme } from "@/constants/app-theme";
import React, { useState } from "react";
import { Alert, ImageBackground, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

//Logga in sidan
export default function LoginPage() {
  const theme = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    Alert.alert("Demo", "Login-funktion kommer snart!");
  };

  const handleRegister = () => {
    Alert.alert("Demo", "Registrering kommer snart!");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/n4.jpg")}
        style={styles.container}
        resizeMode="cover"
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

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Logga in
            </Button>
            <Button
              mode="outlined"
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "bold",
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
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  registerText: {
    fontSize: 16,
    textAlign: "center",
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
