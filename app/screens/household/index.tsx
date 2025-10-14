import { useAppTheme } from "@/constants/app-theme";
import React from "react";
import { Text, View } from "react-native";

export default function Household() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: theme.colors.onSurface,
          textAlign: "center",
        }}
      >
        Här är när man gått in i ett hushåll och ska se lista över chores osv
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.onSurface,
          opacity: 0.7,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Denna sida kommer att utvecklas senare.
      </Text>
    </View>
  );
}
