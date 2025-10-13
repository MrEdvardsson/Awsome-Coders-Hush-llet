//Välj hushåll
import { useAppTheme } from "@/constants/app-theme";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
// Logged in page
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
      <TouchableOpacity onPress={() => router.push("/screens/HousePage")}>
        <Text
          style={{
            color: theme.colors.onPrimary,
          }}
        >
          Välj hushåll
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
        }}
        onPress={() => router.push("/screens/LoginPage")}
      >
        <Text
          style={{
            color: theme.colors.onPrimary,
          }}
        >
          Loginpage
        </Text>
      </TouchableOpacity>
    </View>
  );
}
