import { useAppTheme } from "@/constants/app-theme";
import generateCode from "@/utils/generateCode";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileMock } from "../../../src/data/mockdata";

export default function InfoHousehold() {
  const theme = useAppTheme();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const isAdmin = true;

  const handleGenerateCode = () => {
    const newCode = generateCode();
    console.log("Genererar kod! " + newCode);
    setCode(newCode);
  };

  const handleSetTitle = () => {
    const newTitle = setTitle(title);
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.outline,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          Hushålls info
        </Text>
      </View>
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
            {code || "Ingen Kod hittades"}
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
                  placeholder={title || "Här kommer hushållets namn att synas"}
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
        <FlatList
          style={[
            styles.flatlistNotPending,
            { backgroundColor: theme.colors.background },
          ]}
          data={profileMock.filter((item) => !item.isPending)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                left={() => (
                  <Text style={{ fontSize: 28, marginLeft: 8 }}>
                    {item.avatar}
                  </Text>
                )}
                right={() =>
                  isAdmin && (
                    <TouchableOpacity
                      onPress={() => console.log("Nu tog du bort " + item.name)}
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
          <FlatList
            style={[
              styles.flatlistPending,
              { backgroundColor: theme.colors.background },
            ]}
            data={profileMock.filter((item) => item.isPending)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title
                  title={item.name}
                  left={() => (
                    <Text style={{ fontSize: 28, marginLeft: 8 }}>
                      {item.avatar}
                    </Text>
                  )}
                  right={() => (
                    <View style={styles.iconView}>
                      <TouchableOpacity
                        onPress={() =>
                          console.log("Nu accepterade du " + item.name)
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
                            `Vill du verkligen acceptera ${item.name}?`,
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
