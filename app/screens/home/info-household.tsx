import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";

import {
  ListenToSingleHousehold,
  UpdateCode,
  UpdateTitle,
} from "@/src/data/household-db";
import generateCode from "@/utils/generateCode";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InfoHousehold() {
  const theme = useAppTheme();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const { data: user } = useAuthUser();
  const isAdmin = true;
  const { data } = useLocalSearchParams();
  const initialHousehold = JSON.parse(data as string) as Household;
  const [household, setHousehold] = useState<Household>(initialHousehold);

  useEffect(() => {
    const unsubscribe = ListenToSingleHousehold(household.id, (updated) => {
      console.log("Hushållet uppdaterat i realtid:", updated);
      setHousehold(updated);
    });
    return () => unsubscribe();
  }, [household.id]);

  const handleGenerateCode = async () => {
    const newCode = generateCode();
    console.log("Genererar kod! " + newCode);
    setCode(newCode);

    await UpdateCode({ code: household.code, newCode });
  };

  const handleSetTitle = async () => {
    const newTitle = setTitle(title);

    await UpdateTitle({
      title: household.title,
      newTitle: title,
      code: household.code,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 10,
          marginVertical: 12,
          backgroundColor: theme.colors.tertiary,
          borderRadius: 12,
          paddingRight: 12,
        }}
      >
        <View
          style={[styles.houseCode, { backgroundColor: theme.colors.tertiary }]}
        >
          <Text
            variant="titleLarge"
            style={{
              backgroundColor: theme.colors.tertiary,
              textAlign: "center",
            }}
          >
            {household.code || "Ingen Kod hittades"}
          </Text>
        </View>
        {isAdmin && (
          <Button
            mode="contained"
            onPress={handleGenerateCode}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Skapa ny kod
          </Button>
        )}
      </View>
      <View>
        {isAdmin && (
          <View style={{ borderBottomWidth: 1 }}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                paddingLeft: 12,
                paddingTop: 5,
              }}
            >
              Ange ny titel:
            </Text>
            <View style={styles.titleInputRow}>
              <Card style={[styles.titleInput, { flex: 3 }]}>
                <TextInput
                  mode="outlined"
                  placeholder={household.title || "Titel saknas"}
                  value={title}
                  onChangeText={setTitle}
                  style={{ backgroundColor: theme.colors.surface }}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
              </Card>
              <TouchableOpacity
                style={[
                  styles.toucheableSaveButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => handleSetTitle()}
              >
                <Text variant="titleMedium" style={{ color: "white" }}>
                  Spara
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View style={styles.flatlistView}>
        <FlatList<Member>
          style={[
            styles.flatlistNotPending,
            { backgroundColor: theme.colors.background },
          ]}
          data={household.members?.filter((item) => !item.isPending)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.profileName}
                left={() => (
                  <Text style={{ fontSize: 28, marginLeft: 8 }}>
                    {item.selectedAvatar}
                  </Text>
                )}
                right={() =>
                  isAdmin && (
                    <TouchableOpacity
                      onPress={() =>
                        console.log("Nu tog du bort " + item.profileName)
                      }
                    >
                      <Ionicons
                        name="trash"
                        size={24}
                        color={theme.colors.onSurface}
                        style={styles.trashIcon}
                      />
                    </TouchableOpacity>
                  )
                }
              ></Card.Title>
            </Card>
          )}
        ></FlatList>
      </View>
      <View>
        {isAdmin && (
          <FlatList<Member>
            style={[
              styles.flatlistPending,
              { backgroundColor: theme.colors.background },
            ]}
            data={household.members?.filter((item) => item.isPending)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title
                  title={item.profileName}
                  left={() => (
                    <Text style={{ fontSize: 28, marginLeft: 8 }}>
                      {item.selectedAvatar}
                    </Text>
                  )}
                  right={() => (
                    <View style={styles.iconView}>
                      <TouchableOpacity
                        onPress={() =>
                          console.log("Nu accepterade du " + item.profileName)
                        }
                      >
                        <Ionicons
                          name="checkmark-sharp"
                          size={24}
                          color={"lightgreen"}
                          style={styles.iconCheckmark}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert(
                            "Bekräfta åtgärd",
                            `Vill du verkligen acceptera ${item.profileName}?`,
                            [
                              {
                                text: "Ja",
                                onPress: () =>
                                  console.log("Förfrågan accepterad!"),
                              },
                              {
                                text: "Nej",
                                style: "cancel",
                              },
                            ]
                          )
                        }
                      >
                        <Ionicons
                          name="close"
                          size={24}
                          color={"red"}
                          style={styles.trashIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                ></Card.Title>
              </Card>
            )}
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  flatlistView: {
    borderBottomWidth: 1,
  },
  flatlistNotPending: {
    marginVertical: 10,
  },
  flatlistPending: {
    marginTop: 10,
  },
  card: {
    margin: 10,
    borderRadius: 15,
  },
  houseCode: {
    flex: 1, // tar upp tillgänglig plats
    paddingRight: 12,
    borderRadius: 12,
    paddingVertical: 12,
  },
  trashIcon: {
    margin: 10,
  },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCheckmark: {},
  titleInput: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  titleInputRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  toucheableSaveButton: {
    flex: 1,
    height: "auto",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 20,
  },
});

interface Member {
  id: string;
  profileName: string;
  selectedAvatar: string;
  isPending: boolean;
  isOwner: boolean;
}

interface Household {
  id: string;
  title: string;
  code: string;
  members: Member[];
}
