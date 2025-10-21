import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ProfileModal() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // exempel: du kan skicka med profilnamn

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Profil</Text>
      <Text style={{ marginTop: 10 }}>Namn: {name}</Text>

      <Button title="Stäng" onPress={() => router.back()} />
    </View>
  );
}
