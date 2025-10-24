import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { db } from "@/firebase-config";
import {
  GetHousehold,
  leaveHousehold,
  pendingMember,
  ProfileDb,
  UpdateCode,
  UpdateTitle,
} from "@/src/data/household-db";
import generateCode from "@/utils/generateCode";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
  const [save, setSave] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: householdData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["households", household.id],
    enabled: !!user?.uid && !!household?.id,
    queryFn: async () => {
      const householdRef = doc(db, "households", household.id!);
      const householdSnap = await getDoc(householdRef);
      if (!householdSnap.exists()) {
        throw new Error("Household not found");
      }
      const householdData = {
        id: householdSnap.id,
        ...householdSnap.data(),
      } as GetHousehold;

      const profilesRef = collection(householdRef, "profiles");
      const profilesSnap = await getDocs(profilesRef);
      const profiles = profilesSnap.docs.map((d) => ({
        id: d.id,
        householdId: householdData.id,
        ...d.data(),
      }));

      return {
        ...householdData,
        profiles,
      } as GetHousehold;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (householdData && user) {
      const me = householdData.profiles?.find((m) => m.uid === user.uid);
      setIsOwner(me?.isOwner === true);
    }
  }, [householdData, user]);

  const editTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      await UpdateTitle({
        title: household.title,
        newTitle,
        code: household.code,
      });
      return newTitle;
    },
    onSuccess: (newTitle) => {
      setHousehold((prev) => ({
        ...prev,
        title: newTitle,
      }));
      setSave(true);
      queryClient.invalidateQueries({ queryKey: ["user_extend", user?.uid] });
    },
    onError: (error) => {
      Alert.alert(
        "Fel",
        "Kunde inte uppdatera titel: " + (error as Error).message
      );
    },
  });

  const handleSetTitle = async () => {
    editTitleMutation.mutate(title);
    setSave(true);
  };

  const editHouseholdCode = useMutation({
    mutationFn: async (newCode: string) => {
      await UpdateCode({ code: household.code, newCode });
      return newCode;
    },
    onSuccess: (newCode) => {
      setHousehold((prev) => ({
        ...prev,
        code: newCode,
      }));
      setSave(true);
      queryClient.invalidateQueries({
        queryKey: ["user_extend", user?.uid],
      });
      queryClient.invalidateQueries({ queryKey: ["households", household.id] });
    },
    onError: (error) => {
      Alert.alert(
        "Fel",
        "Kunde inte uppdatera kod: " + (error as Error).message
      );
    },
  });

  const handleGenerateCode = async () => {
    const newCode = generateCode();

    setCode(newCode);
    editHouseholdCode.mutate(newCode);
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

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const currentUserProfile = householdData?.profiles?.find(
        (p) => p.uid === user?.uid
      );
      if (!currentUserProfile) {
        throw new Error("Profil hittades inte");
      }
      return await leaveHousehold(
        household.id,
        currentUserProfile.id,
        user!.uid
      );
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user_extend", user?.uid] });
        Alert.alert("Hushåll lämnat", "Du har lämnat hushållet", [
          {
            text: "OK",
            onPress: () => router.replace("/screens/home"),
          },
        ]);
      } else {
        Alert.alert("Fel", result.error || "Kunde inte lämna hushållet");
      }
    },
    onError: (error) => {
      Alert.alert("Fel", (error as Error).message);
    },
  });

  const handleLeaveHousehold = () => {
    Alert.alert(
      "Lämna hushåll",
      "Är du säker på att du vill lämna detta hushåll?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Lämna",
          style: "destructive",
          onPress: () => leaveMutation.mutate(),
        },
      ]
    );
  };

  const handleProfileSettings = (member: ProfileDb) => {
    router.push({
      pathname: "./profile-modal",
      params: { data: JSON.stringify(member) },
    });
  };

  if (isLoading) return <Text>Laddar...</Text>;
  if (isError) return <Text>Fel: {(error as Error).message}</Text>;
  if (!householdData) return null; // skydd

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
                {householdData.code || "Ingen kod"}
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
                disabled={!title.trim() && save}
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
            <Chip key={householdData.id} mode="outlined" compact>
              {householdData.profiles?.filter((item) => !item.isPending)
                .length || 0}
            </Chip>
          </View>

          <View style={styles.profilesList}>
            {householdData.profiles
              ?.filter((item) => !item.isPending)
              .map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <Divider />}
                  <View
                    style={[
                      styles.memberItem,
                      item.isPaused && {
                        opacity: 0.5,
                        backgroundColor: "#00000010",
                      },
                    ]}
                  >
                    <View style={styles.memberInfo}>
                      <Text style={styles.avatar}>{item.selectedAvatar}</Text>
                      <Text variant="titleMedium">{item.profileName}</Text>
                      {item.isPaused && (
                        <Text variant="titleMedium">Pausad!</Text>
                      )}
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
                    {isOwner && (
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
          (householdData.profiles?.filter((item) => item.isPending).length ??
            0) > 0 && (
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

              {householdData.profiles
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

        {/* Lämna hushåll-knapp */}
        <Surface style={styles.section} elevation={1}>
          <Button
            mode="outlined"
            onPress={handleLeaveHousehold}
            icon="exit-to-app"
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
            loading={leaveMutation.isPending}
          >
            Lämna hushåll
          </Button>
        </Surface>
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
