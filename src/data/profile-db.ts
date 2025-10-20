import { Profile } from "./household-db";
interface ProfleDb extends Profile {
  id: string;
  avatar: string;
  isOwner: boolean;
  isPending: boolean;
  isPaused: boolean;
  householdId: string;
  pausedStart: Date | null;
  pausedEnd: Date | null;
}

// Skapa Profilen
export async function CreateProfile(userId: string, profile: Profile) {}
