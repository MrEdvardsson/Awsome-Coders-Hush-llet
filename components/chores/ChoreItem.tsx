import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Card, Surface, Text } from "react-native-paper";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

type ChoreItemProps = {
  item: any;
  theme: any;
  todayStart: Date;
  userProfile: any;
  completeMutation: any;
  handleDelete: (id: string, title: string) => void;
  householdId: string;
};

export const ChoreItem = React.memo(
  React.forwardRef<SwipeableMethods, ChoreItemProps>(
    (
      {
        item,
        theme,
        todayStart,
        userProfile,
        completeMutation,
        handleDelete,
        householdId,
      },
      ref
    ) => {
      const swipeableRef = React.useRef<SwipeableMethods>(null);

      React.useImperativeHandle(ref, () => ({
        close: () => swipeableRef.current?.close(),
        openLeft: () => swipeableRef.current?.openLeft(),
        openRight: () => swipeableRef.current?.openRight(),
        reset: () => swipeableRef.current?.reset(),
      }));

      const isOverdue =
        item.daysSinceCompleted !== null &&
        item.daysSinceCompleted !== undefined &&
        item.daysSinceCompleted > item.frequencyDays;

      const hasCompletions =
        item.completedByProfiles && item.completedByProfiles.length > 0;

      const userHasCompletedToday = item.completedByProfiles?.some(
        (profile: any) => {
          if (profile.profile_id !== userProfile?.id) return false;
          const completedAt = new Date(profile.completedAt);
          return completedAt >= todayStart;
        }
      );

      const completeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: 0 }],
      }));

      const deleteAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: 0 }],
      }));

      const renderCompleteAction = () => {
        return (
          <Animated.View
            style={[
              styles.rightSwipeAction,
              { backgroundColor: theme.colors.primary },
              completeAnimatedStyle,
            ]}
          >
            <Text
              style={{
                color: theme.colors.onPrimary,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              ✓ Klar
            </Text>
          </Animated.View>
        );
      };

      const renderDeleteAction = () => {
        return (
          <Animated.View
            style={[
              styles.leftSwipeAction,
              { backgroundColor: theme.colors.error },
              deleteAnimatedStyle,
            ]}
          >
            <Text
              style={{
                color: theme.colors.onError,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              🗑️ Ta bort
            </Text>
          </Animated.View>
        );
      };

      const handleSwipeableOpen = (direction: "left" | "right") => {
        if (direction === "right") {
          handleDelete(item.id!, item.title);
        } else if (direction === "left") {
          if (!userHasCompletedToday) {
            completeMutation.mutate(item.id!);
          }
        }

        setTimeout(() => {
          swipeableRef.current?.close();
        }, 300);
      };

      return (
        <ReanimatedSwipeable
          ref={swipeableRef}
          renderLeftActions={renderDeleteAction}
          renderRightActions={
            userHasCompletedToday ? undefined : renderCompleteAction
          }
          friction={2}
          leftThreshold={40}
          rightThreshold={userHasCompletedToday ? Infinity : 40}
          onSwipeableOpen={handleSwipeableOpen}
          overshootLeft={false}
          overshootRight={false}
        >
          <Card
            style={styles.card}
            mode="elevated"
            elevation={2}
            onPress={() =>
              router.push({
                pathname: "/screens/household/chores/chore-details",
                params: {
                  householdId,
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  frequencyDays: item.frequencyDays.toString(),
                  weight: item.weight.toString(),
                  assignedTo: item.assignedTo || "",
                  daysSinceCompleted:
                    item.daysSinceCompleted?.toString() || "0",
                  lastCompletedAt: item.lastCompletedAt?.toISOString() || "",
                },
              })
            }
          >
            <Card.Content>
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={styles.titleText}>
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text
                      variant="bodySmall"
                      numberOfLines={1}
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 4,
                      }}
                    >
                      {item.description}
                    </Text>
                  )}
                </View>

                {hasCompletions ? (
                  <View style={styles.avatarContainer}>
                    {item
                      .completedByProfiles!.slice(0, 3)
                      .map((profile: any, index: number) => (
                        <Surface
                          key={`${item.id}-${profile.profile_id}-${index}`}
                          style={[
                            styles.avatarChip,
                            {
                              backgroundColor: theme.colors.primaryContainer,
                              marginLeft: index > 0 ? -8 : 0,
                              zIndex: item.completedByProfiles!.length - index,
                            },
                          ]}
                          elevation={2}
                        >
                          <Text style={styles.avatarEmoji}>
                            {profile.selectedAvatar}
                          </Text>
                        </Surface>
                      ))}
                    {item.completedByProfiles!.length > 3 && (
                      <Surface
                        style={[
                          styles.avatarChip,
                          {
                            backgroundColor: theme.colors.secondaryContainer,
                            marginLeft: -8,
                            zIndex: 0,
                          },
                        ]}
                        elevation={2}
                      >
                        <Text
                          variant="labelSmall"
                          style={{
                            color: theme.colors.onSecondaryContainer,
                            fontWeight: "bold",
                          }}
                        >
                          +{item.completedByProfiles!.length - 3}
                        </Text>
                      </Surface>
                    )}
                  </View>
                ) : (
                  <Surface
                    style={[
                      styles.daysChip,
                      {
                        backgroundColor: isOverdue
                          ? theme.colors.errorContainer
                          : theme.colors.secondaryContainer,
                      },
                    ]}
                    elevation={0}
                  >
                    <Text
                      variant="labelLarge"
                      style={{
                        color: isOverdue
                          ? theme.colors.error
                          : theme.colors.onSecondaryContainer,
                        fontWeight: "bold",
                      }}
                    >
                      {item.daysSinceCompleted ?? 0}
                    </Text>
                  </Surface>
                )}
              </View>
            </Card.Content>
          </Card>
        </ReanimatedSwipeable>
      );
    }
  )
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleText: {
    fontWeight: "600",
  },
  daysChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarChip: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  avatarEmoji: {
    fontSize: 20,
  },
  leftSwipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginBottom: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightSwipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
