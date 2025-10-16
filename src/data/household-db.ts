import { db } from "@/firebase-config";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";

interface Household {
  title: string;
  code: string;
}

interface GetHousehold {
  id: string;
  title: string;
  code: string;
}

export async function AddHousehold(household: Household) {
  const profileRef = doc(collection(db, "profiles"));
  console.log("Förgenererat ID:", profileRef.id);

  const profile = {
    id: profileRef.id,
    name: "Admin",
    avatar: "👑",
    isOwner: true,
  };

  await setDoc(profileRef, profile);

  const householdDoc = {
    title: household.title,
    code: household.code,
    members: [profile],
    chores: [],
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, "households"), householdDoc);
  console.log("✅ Hushåll skapat med ID:", docRef.id);
}

export async function GetHouseholds(): Promise<GetHousehold[]> {
  const querySnapshot = await getDocs(collection(db, "households"));

  const households: GetHousehold[] = querySnapshot.docs.map((h) => {
    const data = h.data() as Omit<Household, "id">;

    return {
      id: h.id,
      ...data,
    };
  });

  return households;
}
