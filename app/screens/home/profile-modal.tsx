import { useAppTheme } from "@/constants/app-theme";
import { updateProfileInHousehold } from "@/src/data/household-db";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Card, Switch, Text } from "react-native-paper";
import { Member } from "./info-household";

export default function ProfileModal() {
  const theme = useAppTheme();
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const initialMember = JSON.parse(data as string) as Member;
  const [member, setMember] = useState<Member>(initialMember);

  const updateMemberMutation = useMutation({
    mutationFn: updateProfileInHousehold,
    onSuccess: () => {
      console.log("✅ Member updated!");
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
                <Text variant="headlineMedium">isDeleted</Text>
                <Switch
                  value={member.isDeleted}
                  onValueChange={(v) => setMember({ ...member, isDeleted: v })}
                />
              </Card.Content>
            </Card>
            <Card style={style.cardStyle}>
              <Card.Content style={style.cardContent}>
                <Text variant="headlineMedium">isPaused</Text>
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
