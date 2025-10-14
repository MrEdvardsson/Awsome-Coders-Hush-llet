import { Text, View } from "react-native";
import { useAppTheme } from "@/constants/app-theme";

export default function ChoreDetail() {
    const theme = useAppTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
            <Text>Chore Detail Page</Text>
        </View>
    );
}