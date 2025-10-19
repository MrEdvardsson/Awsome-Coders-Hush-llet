import {
  GetHousehold,
  getHouseholdByInvitationCode,
  joinHousehold,
  Profile,
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

    const existingProfile = household.members.find(
      (member: any) => member.uid === currentUserId
    );

    if (existingProfile)
      return {
        isSuccess: false,
        errorMessage: "Du är redan medlem i detta hushåll",
      };

    if (household.members.length === 8)
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
  const memberNames: string[] = household.members.map((m) => m.profileName);

  if (!profileName.trim()) return "Måste ha ett profilnamn";
  if (!selectedAvatar) return "Måste välja en Avatar";
  if (memberNames?.some((m) => m.toLowerCase() === profileName.toLowerCase()))
    return "Finns redan en användare med detta profilnamnet";
  return null;
}

export function getAvailableAvatars(houseHold: GetHousehold): string[] {
  const membersAvatars = houseHold?.members.map((m) => m.selectedAvatar);
  const availableAvatars = avatars.filter(
    (avatar) => !membersAvatars.includes(avatar)
  );

  return availableAvatars;
}

export async function handleJoinHousehold(
  houseHold: GetHousehold,
  userId: string,
  profile: Profile
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
