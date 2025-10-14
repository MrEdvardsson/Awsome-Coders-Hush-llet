import { useAppTheme } from "@/constants/app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileMock } from "../../../src/data/mockdata";

export default function InfoHousehold() {
  const theme = useAppTheme();
  const isAdmin = true;

  //TODO Detta är Admin vy. Måste lägga till gästvy
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
        style={[styles.houseCode, { backgroundColor: theme.colors.primary }]}
      >
        <Text variant="titleLarge">HushållsKod</Text>
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
    marginBottom: 10,
  },
  flatlistPending: {
    marginTop: 10,
  },
  card: {
    margin: 10,
    borderRadius: 15,
  },
  houseCode: {
    alignItems: "center",
    justifyContent: "center",
    height: "12%",
  },
  trashIcon: {
    margin: 10,
  },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCheckmark: {},
});
