import { db } from "@/firebase-config";
import {
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

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
  profiles: ProfileDb[];
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
      houseHold_ids: arrayUnion(householdDoc.id),
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

// export function ListenToHouseholds(
//   userUid: string,
//   callback: (households: GetHousehold[]) => void
// ) {
//   const userExtendRef = doc(db, "user_extend", userUid);

//   const unsubscribe = onSnapshot(userExtendRef, async (snapshot) => {
//     if (!snapshot.exists()) {
//       console.warn("⚠️ No user_extend found for user:", userUid);
//       callback([]);
//       return;
//     }

//     const userExtend = snapshot.data() as UserExtends;

//     const validHouseholds = await validateHouseholdMembership(userExtend);

//     callback(validHouseholds);
//   });

//   return unsubscribe;
// }

// export function ListenToSingleHousehold(
//   householdId: string,
//   callback: (household: GetHousehold) => void
// ) {
//   const householdRef = doc(db, "households", householdId);
//   const profilesRef = collection(db, "households", householdId, "profiles");

//   const unsubscribeHousehold = onSnapshot(householdRef, async (snapshot) => {
//     if (snapshot.exists()) {
//       const household = { id: snapshot.id, ...snapshot.data() } as GetHousehold;

//       const profileSnap = await getDocs(profilesRef);
//       const profiles = profileSnap.docs.map((d) => ({
//         id: d.id,
//         householdId: householdId,
//         ...d.data(),
//       })) as ProfileDb[];

//       const validateHousehold = validateHouseholdMembers(household);

//       const fullData = {
//         ...validateHousehold,
//         profiles,
//       } as GetHousehold;

//       callback(fullData);
//     }
//   });

// Also listen to changes in profiles subcollection
// const unsubscribeProfiles = onSnapshot(profilesRef, async () => {
//     const householdSnap = await getDoc(householdRef);

//     if (householdSnap.exists()) {
//       const household = {
//         id: householdSnap.id,
//         ...householdSnap.data(),
//       } as GetHousehold;

//       const profileSnap = await getDocs(profilesRef);
//       const profiles = profileSnap.docs.map((d) => ({
//         id: d.id,
//         householdId: householdId,
//         ...d.data(),
//       })) as ProfileDb[];

//       const validateHousehold = validateHouseholdMembers(household);

//       const fullData = {
//         ...validateHousehold,
//         profiles,
//       } as GetHousehold;

//       callback(fullData);
//     }
//   });

//   // Return a function that unsubscribes from both listeners
//   return () => {
//     unsubscribeHousehold();
//     unsubscribeProfiles();
//   };
// }

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

export async function getprofilesForHousehold(
  houseId: string
): Promise<ProfileDb[]> {
  const profileRef = collection(db, HOUSEHOLDS, houseId, PROFILES);
  const snapshot = await getDocs(profileRef);
  if (snapshot.empty) return [];
  const profiles = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as ProfileDb)
  );
  return profiles;
}

export async function joinHousehold(
  houseHold: GetHousehold,
  userId: string,
  profile: ProfileDb
) {
  const houseHoldRef = doc(db, HOUSEHOLDS, houseHold.id);
  const profileRef = doc(collection(db, HOUSEHOLDS, houseHold.id, PROFILES));
  const userExtendRef = doc(db, USEREXTENDS, userId);

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

  await runTransaction(db, async (transaction) => {
    transaction.set(profileRef, profileData);

    transaction.set(
      userExtendRef,
      {
        user_uid: userId,
        profile_ids: arrayUnion(profileRef.id),
        houseHold_ids: arrayUnion(houseHold.id),
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
    if (!profile.householdId || !profile.id) {
      throw new Error(
        `Missing required fields: householdId=${profile.householdId}, id=${profile.id}`
      );
    }

    const profileRef = doc(
      db,
      "households",
      profile.householdId,
      "profiles",
      profile.id
    );
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      throw new Error("Profile not found");
    }

    const currentProfile = profileSnap.data() as ProfileDb;
    const wasPaused = currentProfile.isPaused;
    const willBePaused = profile.isPaused;

    const updated: Partial<ProfileDb> = {
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

    await updateDoc(profileRef, updated);

    const updatedSnap = await getDoc(profileRef);
    const updatedProfile = updatedSnap.data() as ProfileDb;

    console.log("✅ Profile updated in subcollection!");
    return {
      ...updatedProfile,
      id: profile.id,
      householdId: profile.householdId,
    };
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
}

export async function getUserProfileForHousehold(
  householdId: string,
  userId: string
): Promise<ProfileDb | null> {
  const profilesRef = collection(db, "households", householdId, "profiles");
  const q = query(profilesRef, where("uid", "==", userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const profileDoc = snapshot.docs[0];
  return { id: profileDoc.id, ...profileDoc.data() } as ProfileDb;
}
