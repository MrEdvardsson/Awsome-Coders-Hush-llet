import { useAppTheme } from "@/constants/app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, FAB, Surface, Text } from "react-native-paper";

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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        {title}
      </Text>

      <Text
        variant="bodyLarge"
        style={[styles.description, { color: theme.colors.onSurface }]}
      >
        {description}
      </Text>

      {isOverdue && (
        <Surface
          style={[
            styles.overdueBox,
            {
              backgroundColor: theme.colors.errorContainer,
            },
          ]}
          elevation={0}
        >
          <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
          <Text variant="titleMedium" style={{ color: theme.colors.error }}>
            Försenad med {daysOverdue} {daysOverdue === 1 ? "dag" : "dagar"}
          </Text>
        </Surface>
      )}

      <Surface
        style={[
          styles.infoBox,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        elevation={1}
      >
        <View style={styles.infoRow}>
          <Ionicons
            name="repeat-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurface, marginLeft: 8 }}
          >
            Återkommer var {frequencyDays} dagar
          </Text>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurface, marginLeft: 8 }}
          >
            Senast gjord: {daysSince} {daysSince === 1 ? "dag" : "dagar"} sedan
          </Text>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <View style={styles.infoRow}>
          <Ionicons
            name="star-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurface, marginLeft: 8 }}
          >
            Värde: {weight}
          </Text>
        </View>

        {assignedTo && assignedTo.trim() !== "" && (
          <>
            <Divider style={{ marginVertical: 12 }} />
            <View style={styles.infoRow}>
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurface, marginLeft: 8 }}
              >
                Tilldelad till: {assignedTo}
              </Text>
            </View>
          </>
        )}
      </Surface>

      <FAB
        icon="pencil"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        onPress={() =>
          router.push({
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
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontWeight: "800",
    marginBottom: 12,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    borderRadius: 16,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  overdueBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
});
