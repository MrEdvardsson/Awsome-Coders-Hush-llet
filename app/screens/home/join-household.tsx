import ChooseProfile from "@/components/household/chose-profile";
import { useAppTheme } from "@/constants/app-theme";
import { getInvitationCode } from "@/src/data/household-db";
import {
  validateInvitationCode,
  validateJoinHousehold,
} from "@/src/services/joinHouseholdService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = ["🦊", "🐷", "🐸", "🐤", "🐙", "🐋", "🦉", "🦄"];

export default function JoinHousehold() {
  //   const theme = useAppTheme();

  //   const [profileName, setProfileName] = useState("");
  //   const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  //   const [invitationCode, setInvitationCode] = useState("");
  //   const [error, setError] = useState<string | null>(null);
  //   const [loading, setLoading] = useState(false);

  //   function handleJoinHousehold() {
  //     setLoading(true);
  //     setError(null);
  //     const result = validateJoinHousehold(
  //       profileName,
  //       selectedAvatar,
  //       invitationCode
  //     );
  //     if (result !== null) setError(result);
  //     else {
  //     }
  //     setLoading(false);
  //   }

  //   return (
  //     <SafeAreaView
  //       style={[styles.container, { backgroundColor: theme.colors.background }]}
  //     >
  //       <ScrollView style={styles.content}>
  //         <View style={styles.section}>
  //           <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
  //             Profilnamn
  //           </Text>
  //           <TextInput
  //             mode="outlined"
  //             placeholder="Ange ditt namn"
  //             value={profileName}
  //             onChangeText={setProfileName}
  //             style={{ backgroundColor: theme.colors.surface }}
  //             outlineColor={theme.colors.outline}
  //             activeOutlineColor={theme.colors.primary}
  //           />
  //         </View>

  //         <View style={styles.section}>
  //           <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
  //             Välj avatar
  //           </Text>
  //           <View style={styles.avatarGrid}>
  //             {avatars.map((avatar, index) => (
  //               <TouchableOpacity
  //                 key={index}
  //                 style={[
  //                   styles.avatarButton,
  //                   {
  //                     backgroundColor:
  //                       selectedAvatar === avatar
  //                         ? theme.colors.primary + "20"
  //                         : theme.colors.surface,
  //                     borderColor:
  //                       selectedAvatar === avatar
  //                         ? theme.colors.primary
  //                         : "transparent",
  //                   },
  //                 ]}
  //                 onPress={() => setSelectedAvatar(avatar)}
  //               >
  //                 <Text variant={"titleLarge"}>{avatar}</Text>
  //               </TouchableOpacity>
  //             ))}
  //             <Text
  //               variant="bodySmall"
  //               style={{
  //                 color: theme.colors.onSurface,
  //                 opacity: 0.7,
  //                 textAlign: "center",
  //               }}
  //             >
  //               Ej klickbar avatar är redan tagen
  //             </Text>
  //           </View>
  //         </View>

  //         <View style={styles.section}>
  //           <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
  //             Inbjudningskod
  //           </Text>
  //           <TextInput
  //             mode="outlined"
  //             placeholder="Ange inbjudningskod"
  //             value={invitationCode}
  //             onChangeText={setInvitationCode}
  //             style={{ backgroundColor: theme.colors.surface }}
  //             outlineColor={theme.colors.outline}
  //             activeOutlineColor={theme.colors.primary}
  //           />
  //           <Text
  //             variant="bodySmall"
  //             style={{
  //               color: theme.colors.onSurface,
  //               opacity: 0.7,
  //               textAlign: "center",
  //             }}
  //           >
  //             Efter att du har tryckt på gått med så behöver en administratör i
  //             hushållet acceptera din ansökan
  //           </Text>
  //         </View>
  //       </ScrollView>
  //       <View style={styles.joinButton}>
  //         <Button
  //           mode="contained"
  //           onPress={handleJoinHousehold}
  //           disabled={
  //             !profileName.trim() || !selectedAvatar || !invitationCode.trim()
  //           }
  //           buttonColor={theme.colors.primary}
  //           textColor={theme.colors.onPrimary}
  //         >
  //           Gå med
  //         </Button>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }
  const automaticCode = "16O10NRY8M";
  const theme = useAppTheme();
  const [isSuccess, setIssuccess] = useState<boolean>(false);
  const [invitationCode, setInvitationCode] = useState(automaticCode);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["invitationCode", invitationCode],
    queryFn: () => getInvitationCode(invitationCode),
    enabled: false,
    retry: false,
  });

  async function handleOnClick() {
    setError(null);
    const validationError = validateInvitationCode(invitationCode);
    if (validationError) {
      setError(validationError);
      return;
    }
    setInvitationCode(invitationCode);
    const result = await query.refetch();
    if (!result.data?.isSucces) {
      setError("Koden är ej giltig");
    } else {
      setIssuccess(true);
    }
  }

  if (!isSuccess)
    return (
      <SafeAreaView
        style={[style.container, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView
          style={style.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={style.content}>
            <View style={{ marginBottom: theme.custom.spacing.md }}>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurface }}
              >
                Inbjudningskod
              </Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="Ange inbjudningskod"
              value={invitationCode}
              onChangeText={setInvitationCode}
              style={{ backgroundColor: theme.colors.surface }}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                opacity: 0.7,
                textAlign: "center",
                marginTop: theme.custom.spacing.sm,
              }}
            >
              Efter att du har tryckt på gått med så behöver en administratör i
              hushållet acceptera din ansökan
            </Text>
            <Button
              mode="contained"
              onPress={handleOnClick}
              style={{ marginTop: theme.custom.spacing.md }}
              disabled={invitationCode.length < 5}
            >
              Gå med i hushåll
            </Button>
            {error ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                {error}
              </Text>
            ) : null}
            {query.error ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                {query.error.message}
              </Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  if (isSuccess) return <ChooseProfile />;
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     marginBottom: 8,
//   },
//   avatarGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   avatarButton: {
//     width: "22%",
//     aspectRatio: 1,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   joinButton: {
//     marginTop: 32,
//     marginBottom: 32,
//     marginHorizontal: 16,
//   },
// });

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    marginBottom: 50,
  },
});
