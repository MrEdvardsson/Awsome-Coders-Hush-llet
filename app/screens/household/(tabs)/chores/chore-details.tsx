import { useAppTheme } from "@/constants/app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ChoreParams = {
  id: string;
  householdId: string;
  title: string;
  description: string;
  frequencyDays: string;
  weight: string;
  assignedTo?: string;
  daysSinceCompleted?: string;
};

export default function ChoreDetail() {
  const theme = useAppTheme();
  const {
    id,
    householdId,
    title,
    description,
    frequencyDays,
    weight,
    assignedTo,
    daysSinceCompleted,
  } = useLocalSearchParams<ChoreParams>();

  const daysSince = parseInt(daysSinceCompleted || "0");
  const frequency = parseInt(frequencyDays || "0");
  const isOverdue = daysSince > frequency;
  const daysOverdue = daysSince - frequency;

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

      {isOverdue && (
        <View
          style={[
            styles.overdueBox,
            {
              backgroundColor: theme.colors.errorContainer,
              borderColor: theme.colors.error,
            },
          ]}
        >
          <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
          <Text style={[styles.overdueText, { color: theme.colors.error }]}>
            Försenad med {daysOverdue} {daysOverdue === 1 ? "dag" : "dagar"}
          </Text>
        </View>
      )}

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
          Senast gjord: {daysSince} {daysSince === 1 ? "dag" : "dagar"} sedan
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
        style={[styles.editButton, { backgroundColor: theme.colors.secondary }]}
        onPress={() => router.push({
          pathname: "/screens/household/chores/edit-chore",
          params: {
            id,
            householdId,
            title,
            description,
            frequencyDays,
            weight,
            assignedTo,
          },
        })}
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
  overdueBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    gap: 10,
  },
  overdueText: {
    fontSize: 16,
    fontWeight: "600",
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
