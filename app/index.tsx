//Välj hushåll
import { useAppTheme } from "@/constants/app-theme";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const theme = useAppTheme();
  return (
    //example with theme.
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          padding: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
        }}
        onPress={() => router.push({ pathname: "/housePage/sysslor" })}
      >
        <Text
          style={{
            color: theme.colors.onPrimary,
          }}
        >
          Välj hushåll
        </Text>
      </TouchableOpacity>
    </View>
  );
}
