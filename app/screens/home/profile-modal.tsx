import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { ProfileDb, updateProfileInHousehold } from "@/src/data/household-db";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Card, Switch, Text } from "react-native-paper";

export default function ProfileModal() {
  const theme = useAppTheme();
  const { data: user } = useAuthUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const initialMember = JSON.parse(data as string) as ProfileDb;
  const [member, setMember] = useState<ProfileDb>(initialMember);

  const updateMemberMutation = useMutation({
    mutationFn: updateProfileInHousehold,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profiles", updatedProfile.id], updatedProfile);

      queryClient.invalidateQueries({
        queryKey: ["households", updatedProfile.householdId],
      });
      router.back();
    },
    onError: (error) => {
      console.error("❌ Error updating member:", error);
      alert("Något gick fel vid uppdateringen");
      router.back();
    },
  });

  const handleSaveButton = () => {
    const updatedMember = member;
    console.log(updatedMember);
    updateMemberMutation.mutate(updatedMember);
  };

  const handleDeleteButton = () => {
    Alert.alert(
      "Radera medlem",
      `Är du säker på att du vill radera ${member.profileName}? Detta går inte att ångra.`,
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "Radera",
          style: "destructive",
          onPress: () => {
            const deletedMember = { ...member, isDeleted: true };
            updateMemberMutation.mutate(deletedMember);
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => router.back()}>
      <View
        style={[
          style.modalContainer,
          { backgroundColor: `${theme.colors.background}CC` },
        ]}
      >
        <View
          style={[
            style.infoContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={style.cardContainer}>
            <Card style={style.cardStyle}>
              <Card.Title
                title={member.profileName}
                left={() => (
                  <Text style={{ fontSize: 28, marginLeft: 8 }}>
                    {member.selectedAvatar}
                  </Text>
                )}
                right={
                  user?.uid !== member.uid
                    ? () => (
                        <TouchableOpacity
                          onPress={handleDeleteButton}
                          style={{ marginRight: 12 }}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={28}
                            color={theme.colors.error}
                          />
                        </TouchableOpacity>
                      )
                    : undefined
                }
              />
            </Card>
            <Card style={style.cardStyle}>
              <Card.Content style={style.cardContent}>
                <Text variant="headlineMedium">isOwner</Text>
                <Switch
                  value={member.isOwner}
                  onValueChange={(v) => setMember({ ...member, isOwner: v })}
                />
              </Card.Content>
            </Card>
            <Card style={style.cardStyle}>
              <Card.Content style={style.cardContent}>
                {!member.isPaused && (
                  <Text variant="headlineMedium">Pausa:</Text>
                )}
                {member.isPaused && (
                  <Text variant="headlineMedium">Aktivera:</Text>
                )}
                <Switch
                  value={member.isPaused}
                  onValueChange={(v) => setMember({ ...member, isPaused: v })}
                />
              </Card.Content>
            </Card>
            <Card
              style={[
                style.footerCard,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                handleSaveButton();
              }}
            >
              <Card.Content style={style.footerCardContent}>
                <Text variant="titleLarge">Spara </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  infoContainer: {
    padding: 20,
    height: "50%",
    marginVertical: 20,
    justifyContent: "center",
  },
  textInfo: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardContainer: {
    width: "100%",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  cardStyle: {
    margin: 10,
    borderRadius: 15,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCard: {
    margin: 10,
    borderRadius: 15,
    width: "40%",
    alignSelf: "center",
  },
  footerCardContent: {
    alignItems: "center",
  },
});
