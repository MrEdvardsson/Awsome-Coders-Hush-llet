import { db } from "@/firebase-config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

export type Chore = {
  id?: string;
  title: string;
  description: string;
  frequencyDays: number;
  weight: number;
  assignedTo?: string | null;
  isArchived: boolean;
  lastCompletedAt?: Date | null; 
  daysSinceCompleted?: number | null; 
};
export async function getChores(householdId: string): Promise<Chore[]> {
  const ref = collection(db, "households", householdId, "chores");
  const snapshot = await getDocs(ref);

  const chores = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chore[];

  for (const chore of chores) {
    const completedRef = collection(
      db, 
      "households", 
      householdId, 
      "chores", 
      chore.id!, 
      "completedBy"
    );
    
    // Hämta endast det senaste completedBymen sorterat på completedAt, desc så vi får det senaste först)
    const q = query(
      completedRef,
      orderBy("completedAt", "desc")
    );
    
    const completedSnapshot = await getDocs(q);
    
    if (!completedSnapshot.empty) {
      const lastCompleted = completedSnapshot.docs[0].data().completedAt;
      if (lastCompleted?.toDate) {
        chore.lastCompletedAt = lastCompleted.toDate();
        
        const now = new Date();
        const lastCompletedDate = chore.lastCompletedAt;
        if (lastCompletedDate) {
          const diffTime = now.getTime() - lastCompletedDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          chore.daysSinceCompleted = diffDays;
        }
      }
    } else {
      chore.lastCompletedAt = null;
      
      const choreData = snapshot.docs.find(doc => doc.id === chore.id);
      const createdAt = choreData?.data().createdAt;
      
      if (createdAt?.toDate) {
        const now = new Date();
        const createdDate = createdAt.toDate();
        const diffTime = now.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        chore.daysSinceCompleted = diffDays;
      } else {
        chore.daysSinceCompleted = 0;
      }
    }
  }

  return chores;
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
//Samuel jag ändrade om denn när jag ändå satt med samma däruppe, så att den passar in med den nya strukturen för completedBy
  const ref = collection(
    db, 
    "households", 
    householdId, 
    "chores", 
    choreId, 
    "completedBy"
  );
  await addDoc(ref, {
    profile_id: profileId, 
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
