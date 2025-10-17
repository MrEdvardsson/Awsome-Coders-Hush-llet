import { db } from "@/firebase-config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const HOUSEHOLDS = "households";

interface Household {
  title: string;
  code: string;
}

export interface Profile {
  profileName: string;
  selectedAvatar: string;
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
  }[];
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
  console.log("Förgenererat ID:", profileRef.id);

  const p = {
    id: profileRef.id,
    uid: userUid,
    profileName: profile.profileName,
    selectedAvatar: profile.selectedAvatar,
    isOwner: true,
    household_id: "",
  };

  await setDoc(profileRef, p);

  const householdDoc = {
    title: household.title,
    code: household.code,
    members: [p],
    chores: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "households"), householdDoc);

  const userExtendRef = doc(db, "user_extend", userUid);
  await setDoc(
    userExtendRef,
    {
      user_uid: [userUid],
      profile_ids: arrayUnion(profileRef.id),
      household_ids: arrayUnion(docRef.id),
    },
    { merge: true }
  );

  await updateDoc(profileRef, { household_id: docRef.id });

  console.log("✅ Hushåll skapat med ID:", docRef.id);
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
    households.forEach((h) =>
      console.log(
        "Hushåll:",
        h.id,
        "→ members:",
        h.members,
        "hushållskod: ",
        h.code
      )
    );

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

// Vad behöver jag ha här?
// Först skapa profil.
// Behöver först koden?
export async function joinHousehold(code: string) {}

// Här ska jag hämta koden för ett hushåll
// Ska man hämta alla hushåll i kollektionen?
// Ska jag returnera hela hushållet eller bara koden?
// Om jag returnerar hela hushållet så behöver jag inte göra ett till databasanrop?
export async function getInvitationCode(
  invitationCode: string
): Promise<{ isSucces: boolean; household: GetHousehold | null }> {
  const q = query(
    collection(db, HOUSEHOLDS),
    where("code", "==", invitationCode)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return { isSucces: false, household: null };

  const doc = snapshot.docs[0];
  const houseHold = { id: doc.id, ...doc.data() } as GetHousehold;
  return { isSucces: true, household: houseHold };
}
