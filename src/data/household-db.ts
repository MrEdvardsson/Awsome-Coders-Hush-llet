import { db } from "@/firebase-config";
import {
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  validateHouseholdMembers,
  validateHouseholdMembership,
} from "../services/householdService";

const HOUSEHOLDS = "households";
const PROFILES = "profiles";
const USEREXTENDS = "user_extend";

export interface Household {
  title: string;
  code: string;
}

export interface GetHousehold {
  id: string;
  title: string;
  code: string;
  profiles?: ProfileDb[];
  // members: {
  //   id: string;
  //   householdId: string;
  //   profileName: string;
  //   isOwner: boolean;
  //   selectedAvatar: string;
  //   uid: string;
  //   isPending: boolean;
  //   isPaused: boolean;
  //   isDeleted: boolean;
  //   pausedStart?: Timestamp | Date | FieldValue | null;
  //   pausedEnd?: Timestamp | Date | FieldValue | null;
  // }[];
}

export interface UserExtends {
  user_uid: string;
  profile_ids: string[];
  houseHold_ids: string[];
}

interface UpdateCode {
  code: string;
  newCode: string;
}

interface UpdateTitle {
  code: string;
  title: string;
  newTitle: string;
}

export interface Profile {
  profileName: string;
  selectedAvatar: string;
}

export interface ProfileDb extends Profile {
  id: string;
  uid: string;
  isOwner: boolean;
  isPending: boolean;
  isPaused: boolean;
  householdId: string;
  pausedStart?: Timestamp | Date | FieldValue | null;
  pausedEnd?: Timestamp | Date | FieldValue | null;
  isDeleted: boolean;
}

export async function AddHousehold(
  userUid: string,
  household: Household,
  profile: Profile
) {
  const houseRef = doc(collection(db, "households"));
  const profileRef = doc(collection(db, "households", houseRef.id, "profiles"));
  console.log("Förgenererat ID:", profileRef.id);

  const p = {
    id: profileRef.id,
    uid: userUid,
    profileName: profile.profileName,
    selectedAvatar: profile.selectedAvatar,
    isOwner: true,
    isPending: false,
    isPaused: false,
    isDeleted: false,
  };

  const householdDoc = {
    id: houseRef.id,
    title: household.title,
    code: household.code,
    chores: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(houseRef, householdDoc);
  await setDoc(profileRef, p);

  const userExtendRef = doc(db, "user_extend", userUid);
  await setDoc(
    userExtendRef,
    {
      user_uid: userUid,
      profile_ids: arrayUnion(profileRef.id),
      household_ids: arrayUnion(householdDoc.id),
    },
    { merge: true }
  );

  console.log("✅ Hushåll skapat med ID:", householdDoc.id);
}

export async function GetHouseholds(userUid: string): Promise<GetHousehold[]> {
  const q = query(
    collection(db, "user_extend"),
    where("user_uid", "==", userUid)
  );

  const snapshot = await getDocs(q);

  const households = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as GetHousehold)
  );

  return households;
}

export function ListenToHouseholds(
  userUid: string,
  callback: (households: GetHousehold[]) => void
) {
  const userExtendRef = doc(db, "user_extend", userUid);

  const unsubscribe = onSnapshot(userExtendRef, async (snapshot) => {
    if (!snapshot.exists()) {
      console.warn("⚠️ No user_extend found for user:", userUid);
      callback([]);
      return;
    }

    const userExtend = snapshot.data() as UserExtends;

    const validHouseholds = await validateHouseholdMembership(userExtend);

    callback(validHouseholds);
  });

  return unsubscribe;
}

export function ListenToSingleHousehold(
  householdId: string,
  callback: (household: GetHousehold) => void
) {
  const ref = doc(db, "household", householdId);
  const membersRef = collection(db, "households", householdId, "profiles");

  const unsubscribe = onSnapshot(ref, async (snapshot) => {
    if (snapshot.exists()) {
      const household = { id: snapshot.id, ...snapshot.data() } as GetHousehold;

      const profileSnap = await getDocs(membersRef);
      const profiles = profileSnap.docs.map((d) => d.data());

      const validateHousehold = validateHouseholdMembers(household);

      const fullData = {
        ...validateHousehold,
        profiles,
      } as GetHousehold;

      callback(fullData);
    }
  });

  return unsubscribe;
}

export async function UpdateCode(prop: UpdateCode): Promise<void> {
  const q = query(collection(db, "households"), where("code", "==", prop.code));
  const snapshot = await getDocs(q);

  const docRef = snapshot.docs[0].ref;

  await updateDoc(docRef, { code: prop.newCode });
}

export async function UpdateTitle(prop: UpdateTitle): Promise<void> {
  const q = query(collection(db, "households"), where("code", "==", prop.code));
  const snapshot = await getDocs(q);

  const docRef = snapshot.docs[0].ref;

  await updateDoc(docRef, { title: prop.newTitle });
}

export async function getHouseholdByInvitationCode(
  invitationCode: string,
  userId: string
): Promise<GetHousehold | null> {
  const q = query(
    collection(db, HOUSEHOLDS),
    where("code", "==", invitationCode)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const houseHold = { id: doc.id, ...doc.data() } as GetHousehold;
  return houseHold;
}

export async function joinHousehold(
  houseHold: GetHousehold,
  userId: string,
  profile: ProfileDb
) {
  const houseHoldRef = doc(db, HOUSEHOLDS, houseHold.id);
  const profileRef = doc(collection(db, PROFILES));
  const userExtendRef = doc(db, USEREXTENDS, userId);

  // Detta är korrekt data.

  const profileData: ProfileDb = {
    id: profileRef.id,
    uid: userId,
    profileName: profile.profileName,
    selectedAvatar: profile.selectedAvatar,
    isOwner: false,
    isPending: true,
    isPaused: false,
    householdId: houseHold.id,
    pausedStart: null,
    pausedEnd: null,
    isDeleted: false,
  };

  // const profileData = {
  //   id: profileRef.id,
  //   uid: userId,
  //   profileName: profile.profileName,
  //   selectedAvatar: profile.selectedAvatar,
  //   isOwner: true,
  //   household_id: houseHold.id,
  //   isDeleted: false,
  // };

  await runTransaction(db, async (transaction) => {
    transaction.set(profileRef, profileData);

    transaction.update(houseHoldRef, {
      members: arrayUnion(profileData),
    });

    transaction.set(
      userExtendRef,
      {
        user_uid: userId,
        profile_ids: arrayUnion(profileRef.id),
        household_ids: arrayUnion(houseHoldRef.id),
      },
      { merge: true }
    );
  });
}

export async function getHouseholdByGeneratedCode(
  code: string
): Promise<GetHousehold | null> {
  const q = query(collection(db, HOUSEHOLDS), where("code", "==", code));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const houseHold = { id: doc.id, ...doc.data() } as GetHousehold;
  return houseHold;
}

export async function pendingMember(
  householdId: string,
  profileId: string,
  shouldDelete: boolean
) {
  const profileRef = doc(db, "households", householdId, "profiles", profileId);

  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) {
    throw new Error("Profile not found");
  }

  const updates = shouldDelete
    ? { isDeleted: true, isPending: false }
    : { isPending: false };

  await updateDoc(profileRef, updates);
}

export async function updateProfileInHousehold(profile: ProfileDb) {
  try {
    const householdRef = doc(db, "households", profile.householdId);
    const householdSnap = await getDoc(householdRef);

    if (!householdSnap.exists()) {
      throw new Error("Household not found");
    }

    const data = householdSnap.data();
    const members: ProfileDb[] = data.members || [];

    const updatedMembers = members.map((m) => {
      if (m.id !== profile.id) return m;

      const wasPaused = m.isPaused;
      const willBePaused = profile.isPaused;

      const updated = {
        ...m,
        isOwner: profile.isOwner,
        isDeleted: profile.isDeleted,
        isPaused: willBePaused,
      };

      if (!wasPaused && willBePaused) {
        updated.pausedStart = serverTimestamp();
      }

      if (wasPaused && !willBePaused) {
        updated.pausedEnd = serverTimestamp();
      }

      return updated;
    });

    await updateDoc(householdRef, { members: updatedMembers });

    console.log("✅ Member updated in array!");
    return true;
  } catch (error) {
    console.error("❌ Error updating member:", error);
    throw error;
  }
}
