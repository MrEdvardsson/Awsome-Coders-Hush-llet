import { useAppTheme } from "@/constants/app-theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import registerService from "../../../src/services/registerService";

export default function Register() {
  const theme = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Fel", "Fyll i alla fält!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Fel", "Lösenorden matchar inte!");
      return;
    }

    setLoading(true);
    registerService
      .registerWithEmail(email, password)
      .then(() => {
        Alert.alert(
          "Kontot skapat! 🎉",
          "Ditt konto har skapats och du är nu inloggad.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/screens/home"),
            },
          ]
        );
      })
      .catch((err: any) => {
        console.error("Registrreringsfel:", err);
        // https://firebase.google.com/docs/reference/js/auth#autherrorcodes för den nyfikna!
        let errorMessage = "Nånting gick fel. Försök igen.";
        if (err.code === "auth/email-already-in-use") {
          errorMessage =
            "Den här e-postadressen är redan registrerad. Försök logga in istället.";
        } else if (err.code === "auth/invalid-email") {
          errorMessage =
            "Ogiltig e-postadress. Kontrollera och försök igen. På riktigt?";
        } else if (err.code === "auth/weak-password") {
          errorMessage = "Lösenordet är för weaaak. Använd minst 6 tecken.";
        } else if (err.code === "auth/network-request-failed") {
          errorMessage = "Nätverksfel. Någon kanske pratar i telefon?";
        } else if (err.message) {
          errorMessage = err.message;
        }

        Alert.alert("Woops! 😪", errorMessage);
      })
      .finally(() => setLoading(false));
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
});
