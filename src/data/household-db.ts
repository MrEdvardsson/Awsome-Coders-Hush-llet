import { db } from "@/firebase-config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

interface Household {
  title: string;
  code: string;
}

interface Profile {
  profileName: string;
  selectedAvatar: string;
}

interface GetHousehold {
  id: string;
  title: string;
  code: string;
  members: { uid: string; profileName: string; isOwner: boolean }[];
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
  const q = query(
    collection(db, "households"),
    where("uid", "array-contains", userUid)
  );

  const snapshot = await getDocs(collection(db, "households"));
  const households = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as GetHousehold))
    .filter((h) => h.members.some((m) => m.uid === userUid));

  return households;
}
