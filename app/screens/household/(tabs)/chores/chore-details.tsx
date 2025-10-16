import { useLocalSearchParams, router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/constants/app-theme";

type ChoreParams = {
  id: string;
  title: string;
  description: string;
  frequencyDays: string;
  weight: string;
  assignedTo?: string;
};

export default function ChoreDetail() {
  const theme = useAppTheme();
  const { id, title, description, frequencyDays, weight, assignedTo } =
    useLocalSearchParams<ChoreParams>();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurface }]}>
        {description}
      </Text>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          Återkommer var {frequencyDays} dagar
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          Värde: {weight}
        </Text>

        {assignedTo && assignedTo.trim() !== "" && (
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
            Tilldelad till: {assignedTo}
          </Text>
        )}
      </View>

      <TouchableOpacity
      //TODO ska bara visas om man är admin för hushållet
        style={[
          styles.editButton,
          { backgroundColor: theme.colors.secondary },
        ]}
        onPress={() => router.push("/screens/household/chores/edit-chore")}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  infoBox: {
    borderRadius: 12,
    padding: 15,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 5,
  },
  editButton: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
