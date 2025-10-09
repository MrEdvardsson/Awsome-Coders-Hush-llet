//Välj hushåll
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/housePage/sysslor" })}
    >
      <Text>Välj hushåll</Text>
    </TouchableOpacity>
  );
}
