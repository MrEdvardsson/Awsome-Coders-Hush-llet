import { db } from "@/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export type Chore = {
  id?: string;
  title: string;
  description: string;
  frequencyDays: number;
  weight: number;
  assignedTo?: string | null;
  isArchived: boolean;
};

export async function getChores(householdId: string): Promise<Chore[]> {
  const ref = collection(db, "households", householdId, "chores");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chore[];
}

export async function addChore(householdId: string, chore: Omit<Chore, "id">) {
  const ref = collection(db, "households", householdId, "chores");

  const newChore = {
    ...chore,
    isArchived: chore.isArchived ?? false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(ref, newChore);

  return docRef.id; 
}

export async function markChoreCompleted(
  householdId: string,
  choreId: string,
  profileId: string
) {
  const ref = collection(db, "households", householdId, "completedBy");
  await addDoc(ref, {
    choreId,
    profileId,
    completedAt: serverTimestamp(),
  });
}

export async function updateChore(
  householdId: string,
  choreId: string,
  data: Partial<Chore>
) {
  const ref = doc(db, "households", householdId, "chores", choreId);
  await updateDoc(ref, data);
}
