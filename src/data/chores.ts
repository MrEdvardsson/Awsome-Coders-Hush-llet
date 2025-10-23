import { db } from "@/firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
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
  completedByProfiles?: Array<{
    profile_id: string;
    profileName: string;
    selectedAvatar: string;
    completedAt: Date;
  }>;
};
export async function getChores(householdId: string): Promise<Chore[]> {
  const ref = collection(db, "households", householdId, "chores");
  const snapshot = await getDocs(ref);

  const chores = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chore[];

  const profilesRef = collection(db, "households", householdId, "profiles");
  const profilesSnapshot = await getDocs(profilesRef);
  const profilesMap = new Map<string, any>(
    profilesSnapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }])
  );

  for (const chore of chores) {
    const completedRef = collection(
      db, 
      "households", 
      householdId, 
      "chores", 
      chore.id!, 
      "completedBy"
    );
    
    const q = query(completedRef, orderBy("completedAt", "desc"));
    const completedSnapshot = await getDocs(q);
    
    if (!completedSnapshot.empty) {
      const lastCompleted = completedSnapshot.docs[0].data().completedAt;
      chore.lastCompletedAt = lastCompleted?.toDate() || null;

      const now = new Date();
      const recentCompletions = completedSnapshot.docs
        .map(doc => {
          const data = doc.data();
          const completedAt = data.completedAt?.toDate();
          if (!completedAt) return null;
          
          const daysSince = Math.floor((now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince > chore.frequencyDays) return null;

          const profile = profilesMap.get(data.profile_id);
          if (!profile) return null;

          return {
            profile_id: data.profile_id,
            profileName: profile.profileName,
            selectedAvatar: profile.selectedAvatar,
            completedAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      chore.completedByProfiles = recentCompletions.length > 0 ? recentCompletions : undefined;
    } else {
      chore.lastCompletedAt = null;
      chore.completedByProfiles = undefined;
    }

    const referenceDate = chore.lastCompletedAt || 
                         snapshot.docs.find(doc => doc.id === chore.id)?.data().createdAt?.toDate();
    
    if (referenceDate) {
      const diffTime = new Date().getTime() - referenceDate.getTime();
      chore.daysSinceCompleted = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } else {
      chore.daysSinceCompleted = 0;
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
  const ref = collection(
    db, 
    "households", 
    householdId, 
    "chores", 
    choreId, 
    "completedBy"
  );
  
  const q = query(
    ref,
    orderBy("completedAt", "desc")
  );
  
  const snapshot = await getDocs(q);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const alreadyCompletedToday = snapshot.docs.some(doc => {
    const data = doc.data();
    if (data.profile_id !== profileId) return false;
    
    const completedAt = data.completedAt?.toDate();
    if (!completedAt) return false;
    
    return completedAt >= todayStart;
  });
  
  if (alreadyCompletedToday) {
    return
  }
  
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

export async function deleteChore(
  householdId: string,
  choreId: string
) {
  const ref = doc(db, "households", householdId, "chores", choreId);
  await deleteDoc(ref);
}
