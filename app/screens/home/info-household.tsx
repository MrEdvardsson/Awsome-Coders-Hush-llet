import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";

import {
  GetHousehold,
  ListenToSingleHousehold,
  pendingMember,
  ProfileDb,
  UpdateCode,
  UpdateTitle,
} from "@/src/data/household-db";
import generateCode from "@/utils/generateCode";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InfoHousehold() {
  const theme = useAppTheme();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const { data: user } = useAuthUser();
  const [isOwner, setIsOwner] = useState(false);
  const { data } = useLocalSearchParams();
  const initialHousehold = JSON.parse(data as string) as GetHousehold;
  const [household, setHousehold] = useState<GetHousehold>(initialHousehold);

  useEffect(() => {
    const unsubscribe = ListenToSingleHousehold(household.id, (updated) => {
      setHousehold(updated);

      const me = updated?.profiles?.find((m) => m.uid === user!.uid);

      setIsOwner(me?.isOwner === true);
    });
    return () => unsubscribe();
  }, [household.id]);

  const handleGenerateCode = async () => {
    const newCode = generateCode();

    setCode(newCode);

    await UpdateCode({ code: household.code, newCode });
  };

  const handleSetTitle = async () => {
    setTitle(title);

    await UpdateTitle({
      title: household.title,
      newTitle: title,
      code: household.code,
    });
  };

  const handlePendingProfile = async (member: ProfileDb, accept: boolean) => {
    if (accept) {
      console.log("Accepterar");
      await pendingMember(household.id, member.id, false);
    } else {
      console.log("Nekar");
      await pendingMember(household.id, member.id, true);
    }
  };

  const handleProfileSettings = (member: ProfileDb) => {
    router.push({
      pathname: "./profile-modal",
      params: { data: JSON.stringify(member) },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.codeSection} elevation={2}>
          <View style={styles.codeSectionContent}>
            <View style={styles.codeHeader}>
              <Ionicons
                name="key-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Hushållskod
              </Text>
            </View>

            <Surface style={styles.codeDisplay} elevation={0}>
              <Text variant="headlineSmall" style={styles.codeText}>
                {household.code || "Ingen kod"}
              </Text>
            </Surface>

            {isOwner && (
              <Button
                mode="contained"
                onPress={handleGenerateCode}
                icon="refresh"
                style={styles.generateButton}
              >
                Skapa ny kod
              </Button>
            )}
          </View>
        </Surface>

        {/* Titel-sektion */}
        {isOwner && (
          <Surface style={styles.section} elevation={1}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="create-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Ändra hushållstitel
              </Text>
            </View>
            <View style={styles.titleRow}>
              <TextInput
                mode="outlined"
                placeholder={household.title || "Titel saknas"}
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                dense
              />
              <Button
                mode="contained"
                onPress={handleSetTitle}
                disabled={!title.trim()}
                compact
              >
                Spara
              </Button>
            </View>
          </Surface>
        )}

        {/* Medlemmar-sektion */}
        <Surface style={styles.section} elevation={1}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="people-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Medlemmar
            </Text>
            <Chip mode="outlined" compact>
              {household.profiles?.filter((item) => !item.isPending).length ||
                0}
            </Chip>
          </View>

          <View style={styles.profilesList}>
            {household.profiles
              ?.filter((item) => !item.isPending)
              .map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <Divider />}
                  <View style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.avatar}>{item.selectedAvatar}</Text>
                      <Text variant="titleMedium">{item.profileName}</Text>
                      {item.isOwner && (
                        <Chip
                          mode="flat"
                          compact
                          icon="crown"
                          style={styles.ownerChip}
                        >
                          Ägare
                        </Chip>
                      )}
                    </View>
                    {isOwner && item.uid !== user?.uid && (
                      <View style={styles.actionButtons}>
                        <IconButton
                          icon="cog-outline"
                          size={20}
                          onPress={() => handleProfileSettings(item)}
                        />
                      </View>
                    )}
                  </View>
                </View>
              ))}
          </View>
        </Surface>

        {isOwner &&
          (household.profiles?.filter((item) => item.isPending).length ?? 0) >
            0 && (
            <View>
              <View style={styles.pendingHeader}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Väntande förfrågningar
                </Text>
                <Chip mode="outlined" compact>
                  {household.profiles?.filter((item) => item.isPending)
                    .length || 0}
                </Chip>
              </View>

              {household.profiles
                ?.filter((item) => item.isPending)
                .map((item) => (
                  <Card
                    key={item.id}
                    style={styles.pendingCard}
                    mode="elevated"
                    elevation={1}
                  >
                    <Card.Content style={styles.pendingCardContent}>
                      <View style={styles.pendingMemberInfo}>
                        <Text style={styles.avatar}>{item.selectedAvatar}</Text>
                        <Text variant="titleMedium">{item.profileName}</Text>
                      </View>
                      <View style={styles.actionButtons}>
                        <IconButton
                          icon="check"
                          iconColor={theme.colors.primary}
                          containerColor={theme.colors.primaryContainer}
                          size={20}
                          onPress={() => {
                            Alert.alert(
                              "Acceptera medlem",
                              `Vill du acceptera ${item.profileName}?`,
                              [
                                { text: "Avbryt", style: "cancel" },
                                {
                                  text: "Acceptera",
                                  onPress: () =>
                                    handlePendingProfile(item, true),
                                },
                              ]
                            );
                          }}
                        />
                        <IconButton
                          icon="close"
                          iconColor={theme.colors.error}
                          containerColor={theme.colors.errorContainer}
                          size={20}
                          onPress={() => {
                            Alert.alert(
                              "Neka medlem",
                              `Vill du neka ${item.profileName}?`,
                              [
                                { text: "Avbryt", style: "cancel" },
                                {
                                  text: "Neka",
                                  style: "destructive",
                                  onPress: () =>
                                    handlePendingProfile(item, false),
                                },
                              ]
                            );
                          }}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                ))}
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  codeSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  codeSectionContent: {
    alignItems: "center",
    gap: 16,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  codeDisplay: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  codeText: {
    fontWeight: "bold",
    letterSpacing: 4,
  },
  generateButton: {
    marginTop: 8,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  titleInput: {
    flex: 1,
  },
  profilesList: {
    gap: 8,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    fontSize: 32,
  },
  ownerChip: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 4,
  },
  pendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  pendingCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  pendingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  pendingMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
});

export interface Household {
  id: string;
  title: string;
  code: string;
}
