import { View, Text } from "react-native";
import { useAppTheme } from "@/constants/app-theme";

export default function EditChore() {
  const theme = useAppTheme();
  return (
    <View>
      <Text>Edit Chore</Text>
    </View>
  );
}