import { useAppTheme } from "@/constants/app-theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title: string;
  message?: string;
  buttonText?: string;
  onButtonPress: () => void;
}

export default function Success(props: Props) {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.content]}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          {props.title}
        </Text>
        {props.message && (
          <Text
            variant="bodyMedium"
            style={[styles.message, { color: theme.colors.onSurface }]}
          >
            {props.message}
          </Text>
        )}
        <Button mode="contained" onPress={props.onButtonPress}>
          {props.buttonText || "Fortsätt"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 10,
    margin: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },
  message: {
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
});
