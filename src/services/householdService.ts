import { db } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import {
  GetHousehold,
  getHouseholdByGeneratedCode,
  getHouseholdByInvitationCode,
  joinHousehold,
  ProfileDb,
  UserExtends,
} from "../data/household-db";

const avatars = ["🦊", "🐷", "🐸", "🐤", "🐙", "🐋", "🦉", "🦄"];

export async function validateAndGetHousehold(
  invitationCode: string,
  currentUserId: string
): Promise<{
  isSuccess: boolean;
  houseHold?: GetHousehold;
  errorMessage?: string;
}> {
  if (!invitationCode) {
    return { isSuccess: false, errorMessage: "Ange kod" };
  }

  try {
    const household = await getHouseholdByInvitationCode(
      invitationCode.toUpperCase(),
      currentUserId
    );
    if (!household) return { isSuccess: false, errorMessage: "Oiltig kod" };

    const existingProfile = household.profiles?.find(
      (member: any) => member.uid === currentUserId
    );

    if (existingProfile)
      return {
        isSuccess: false,
        errorMessage: "Du är redan medlem i detta hushåll",
      };

    if (household.profiles?.length === 8)
      return {
        isSuccess: false,
        errorMessage: "Hushållet är fullt (max 8 medlemmar)",
      };

    return { isSuccess: true, houseHold: household };
  } catch (error) {
    //TODO sätta upp felmeddelande hantering.
    console.log("FirebasError ", error);
    throw new Error("Något gick fel");
  }
}

export function validateJoinHouseholdInput(
  profileName: string,
  selectedAvatar: string,
  household: GetHousehold
): string | null {
  const memberNames = household.profiles?.map((m) => m.profileName);

  if (!profileName.trim()) return "Måste ha ett profilnamn";
  if (!selectedAvatar) return "Måste välja en Avatar";
  if (memberNames?.some((m) => m.toLowerCase() === profileName.toLowerCase()))
    return "Finns redan en användare med detta profilnamnet";
  return null;
}

export function getAvailableAvatars(houseHold: GetHousehold): string[] {
  const membersAvatars =
    houseHold?.profiles?.map((m) => m.selectedAvatar) ?? [];

  const availableAvatars = avatars.filter(
    (avatar) => !membersAvatars.includes(avatar)
  );

  return availableAvatars;
}

export async function handleJoinHousehold(
  houseHold: GetHousehold,
  userId: string,
  profile: ProfileDb
) {
  try {
    await joinHousehold(houseHold, userId, profile);
  } catch (error) {
    console.log("Fel i handleHousehold: " + error);
    getJoinHouseHoldErrors(error);
  }
}

function getJoinHouseHoldErrors(error: any) {
  if (error.code) {
    switch (error.code) {
      case "invalid-argument":
        throw new Error("Ogiltiga data. Kontrollera att alla fält är ifyllda");

      case "not-found":
        throw new Error("Hushållet kunde inte hittas");

      case "unauthenticated":
        throw new Error("Du måste logga in för att gå med i hushåll");

      case "unavailable":
        throw new Error("Tjänsten är inte tillgänglig. Försök igen senare");

      default:
        throw new Error("Ett tekniskt fel uppstod. Försök igen");
    }
  }

  if (error.message?.includes("network") || error.message?.includes("fetch")) {
    throw new Error("Internetanslutning saknas. Kontrollera din anslutning");
  }

  throw new Error("Ett oväntat fel uppstod. Försök igen senare");
}

export async function handleCreateHousehold(
  userUid: string,
  profileName: string,
  selectedAvatar: string,
  houseTitle: string,
  houseCode: string
): Promise<{
  isSuccess: boolean;
  errorMessage?: string;
}> {
  if (!userUid) {
    return { isSuccess: false, errorMessage: "Du är inte inloggad" };
  }
  if (!profileName || "") {
    return { isSuccess: false, errorMessage: "Ange profilnamn!" };
  }
  if (!selectedAvatar) {
    return { isSuccess: false, errorMessage: "Ange en avatar" };
  }
  if (!houseTitle || "") {
    return { isSuccess: false, errorMessage: "Du måste ange hustitel!" };
  }
  if (!houseCode) {
    return { isSuccess: false, errorMessage: "Ingen huskod hittades!" };
  }

  try {
    const findHousehold = await getHouseholdByGeneratedCode(houseCode);
    if (findHousehold)
      return {
        isSuccess: false,
        errorMessage: "Hushåll med denna kod finns redan. Försök igen!",
      };

    return { isSuccess: true };
  } catch (error) {
    console.log("FirebasError ", error);
    throw new Error("Något gick fel");
  }
}

export async function validateHouseholdMembership(
  userExtend: UserExtends
): Promise<GetHousehold[]> {
  const validHouseholds: GetHousehold[] = [];

  for (let i = 0; i < userExtend.houseHold_ids.length; i++) {
    const householdId = userExtend.houseHold_ids[i];
    const profileId = userExtend.profile_ids[i];

    const householdRef = doc(db, "households", householdId);
    const householdSnap = await getDoc(householdRef);

    if (!householdSnap.exists()) continue;
    const householdData = householdSnap.data();

    const profileRef = doc(
      db,
      "households",
      householdId,
      "profiles",
      profileId
    );
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) continue;
    const profileData = profileSnap.data() as {
      isPending: boolean;
      isDeleted: boolean;
    };

    if (!profileData.isPending && !profileData.isDeleted) {
      validHouseholds.push({
        id: householdId,
        ...householdData,
      } as GetHousehold);
    }
  }

  return validHouseholds;
}

export function validateHouseholdMembers(
  household: GetHousehold
): GetHousehold {
  return {
    ...household,
    profiles: household.profiles?.filter((m) => !m.isDeleted),
  };
}
