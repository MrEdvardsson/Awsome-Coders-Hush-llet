import { db } from "@/firebase-config";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
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
  pausedStart: Date | null;
  pausedEnd: Date | null;
  isDeleted: boolean;
}

export interface GetHousehold {
  id: string;
  title: string;
  code: string;
  members: {
    id: string;
    profileName: string;
    isOwner: boolean;
    selectedAvatar: string;
    uid: string;
    isPending: boolean;
    isPaused: boolean;
    isDeleted: boolean;
  }[];
}

export interface GetMembers {
  id: string;
  profileName: string;
  isOwner: boolean;
  selectedAvatar: string;
  uid: string;
  isPending: boolean;
  isPaused: boolean;
  isDeleted: boolean;
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

export async function AddHousehold(
  userUid: string,
  household: Household,
  profile: Profile
) {
  const profileRef = doc(collection(db, "profiles"));
  const houseRef = doc(collection(db, "households"));
  console.log("Förgenererat ID:", profileRef.id);

  const p = {
    id: profileRef.id,
    uid: userUid,
    profileName: profile.profileName,
    selectedAvatar: profile.selectedAvatar,
    isOwner: true,
    isPending: false,
    isPaused: false,
    household_id: houseRef.id,

    isDeleted: false,
  };

  const householdDoc = {
    id: houseRef.id,
    title: household.title,
    code: household.code,
    members: [p],
    chores: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(profileRef, p);
  await setDoc(houseRef, householdDoc);

  const userExtendRef = doc(db, "user_extend", userUid);
  await setDoc(
    userExtendRef,
    {
      user_uid: [userUid],
      profile_ids: arrayUnion(profileRef.id),
      household_ids: arrayUnion(householdDoc.id),
    },
    { merge: true }
  );

  await updateDoc(profileRef, { household_id: householdDoc.id });

  console.log("✅ Hushåll skapat med ID:", householdDoc.id);
}

export async function GetHouseholds(userUid: string): Promise<GetHousehold[]> {
  const snapshot = await getDocs(collection(db, "households"));
  const households = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as GetHousehold))
    .filter((h) => h.members.some((m) => m.uid === userUid));

  return households;
}

export function ListenToHouseholds(
  userUid: string,
  callback: (households: GetHousehold[]) => void
) {
  console.log("Startar Firestore-lyssnare för user:", userUid);
  const unsubscribe = onSnapshot(collection(db, "households"), (snapshot) => {
    console.log(
      "🔥 onSnapshot triggas!",
      snapshot.docs.length,
      "dokument hittades"
    );
    const households = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as GetHousehold))
      .filter((h) => h.members.some((m) => m.uid === userUid));
    console.log("Efter filtrering:", households.length, "träffar");

    callback(households);
  });

  return unsubscribe; // så du kan stoppa lyssnaren vid behov
}

export function ListenToSingleHousehold(
  householdId: string,
  callback: (household: GetHousehold) => void
) {
  const ref = doc(db, "households", householdId);

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as GetHousehold);
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
  profile: Profile
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
  const houseHoldRef = doc(db, "households", householdId);

  await runTransaction(db, async (transaction) => {
    const houseHoldSnap = await transaction.get(houseHoldRef);

    const householdData = houseHoldSnap.data() as GetHousehold;
    const updatedMembers = householdData.members.map((member: GetMembers) => {
      if (member.id !== profileId) return member;
      if (shouldDelete) return { ...member, isDeleted: true };
      else {
        return { ...member, isPending: false };
      }
    });

    transaction.update(houseHoldRef, { members: updatedMembers });
  });
}
