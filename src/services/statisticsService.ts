import { ProfileDb } from "../data/household-db";

export interface Chore {
  id: string;
  title: string;
  description: string;
  frequencyDays: number;
  weight: number;
  imageUrl: string | null;
  audioUrl: string | null;
  isArchived: boolean;
  assignedTo: ProfileDb[];
}

export interface CompletedBy {
  profile_id: string;
  completedAt: Date;
  chore_id: string;
}

export const mockProfiles: ProfileDb[] = [
  {
    id: "1",
    uid: "uid_anna_123",
    profileName: "Anna",
    selectedAvatar: "avatar1.png",
    isOwner: true,
    isPending: false,
    isPaused: false,
    pausedStart: null,
    pausedEnd: null,
    householdId: "household_001",
  },
  {
    id: "2",
    uid: "uid_bob_456",
    profileName: "Bob",
    selectedAvatar: "avatar2.png",
    isOwner: false,
    isPending: false,
    isPaused: false,
    pausedStart: null,
    pausedEnd: null,
    householdId: "household_001",
  },
  {
    id: "3",
    uid: "uid_carla_789",
    profileName: "Carla",
    selectedAvatar: "avatar3.png",
    isOwner: false,
    isPending: false,
    isPaused: false,
    pausedStart: null,
    pausedEnd: null,
    householdId: "household_001",
  },
];

export const mockChores: Chore[] = [
  {
    id: "chore_001",
    title: "Diska",
    description: "Diska tallrikar och bestick.",
    frequencyDays: 1,
    weight: 2,
    imageUrl: null,
    audioUrl: null,
    isArchived: false,
    assignedTo: [mockProfiles[0], mockProfiles[1]],
  },
  {
    id: "chore_002",
    title: "Dammsuga vardagsrummet",
    description: "Dammsug hela vardagsrummet.",
    frequencyDays: 3,
    weight: 3,
    imageUrl: null,
    audioUrl: null,
    isArchived: false,
    assignedTo: [mockProfiles[1]],
  },
  {
    id: "chore_003",
    title: "Ta ut soporna",
    description: "Töm alla sopkorgar och gå ut med soporna.",
    frequencyDays: 2,
    weight: 1,
    imageUrl: null,
    audioUrl: null,
    isArchived: false,
    assignedTo: [mockProfiles[2]],
  },
  {
    id: "chore_004",
    title: "Vattna blommor",
    description: "Vattna alla växter.",
    frequencyDays: 4,
    weight: 1,
    imageUrl: null,
    audioUrl: null,
    isArchived: false,
    assignedTo: [mockProfiles[2]],
  },
  {
    id: "chore_005",
    title: "Vattna blommor",
    description: "Vattna alla växter.",
    frequencyDays: 4,
    weight: 1,
    imageUrl: null,
    audioUrl: null,
    isArchived: false,
    assignedTo: [mockProfiles[2]],
  },
];

export const mockedCompletedByChores: {
  profile_id: string;
  chore_id: string;
  completedAt: Date;
}[] = [
  {
    profile_id: "1",
    chore_id: "chore_001",
    completedAt: new Date("2025-10-20T08:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-10-20T10:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-10-20T12:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-10-20T14:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_001",
    completedAt: new Date("2025-10-20T16:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-10-20T18:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-10-20T20:00:00Z"),
  },

  // === Förra veckan (2025-10-13 – 2025-10-19) ===
  {
    profile_id: "2",
    chore_id: "chore_001",
    completedAt: new Date("2025-10-13T09:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-10-13T18:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-10-14T10:00:00Z"),
  },
  {
    profile_id: "1",
    chore_id: "chore_001",
    completedAt: new Date("2025-10-14T19:30:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-10-15T17:45:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-10-16T08:15:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-10-17T12:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-10-17T20:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_001",
    completedAt: new Date("2025-10-18T11:30:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-10-19T18:45:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_005",
    completedAt: new Date("2025-10-19T18:45:00Z"),
  },

  // === Förra månaden (september 2025) ===
  {
    profile_id: "1",
    chore_id: "chore_001",
    completedAt: new Date("2025-09-02T18:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-09-03T19:15:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-09-04T09:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-09-05T17:30:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_001",
    completedAt: new Date("2025-09-06T20:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-09-07T10:30:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-09-08T12:00:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-09-10T18:00:00Z"),
  },
  {
    profile_id: "1",
    chore_id: "chore_001",
    completedAt: new Date("2025-09-11T19:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-09-13T08:30:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-09-15T11:45:00Z"),
  },
  {
    profile_id: "2",
    chore_id: "chore_002",
    completedAt: new Date("2025-09-17T09:30:00Z"),
  },
  {
    profile_id: "1",
    chore_id: "chore_001",
    completedAt: new Date("2025-09-20T20:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_003",
    completedAt: new Date("2025-09-25T18:00:00Z"),
  },
  {
    profile_id: "3",
    chore_id: "chore_004",
    completedAt: new Date("2025-09-28T10:00:00Z"),
  },
];

// Interface statistic för profilen i den totala Pajen. SERVICE
interface ProfileStatisticsTotal {
  profile: ProfileDb;
  valuePoints: number;
  completedCount: number;
}

//Interface för varje slice. Alltså datan för en slice i PieCharten UI
export interface PieChartSliceData {
  text: string;
  value: number;
  color: string;
}

interface TotalPieStats {
  numberOfChores: number;
  totalValuePoints: number;
  profileData: ProfileStatisticsTotal[];
}

interface IndividualChoresPieStats {
  choreId: string;
  choreTitle: string; // Skriver ut Titeln på sysslan.
  sliceData: PieChartSliceData[]; // Denna datan är för att skriva ut datan i Pajen.
}

// Det är detta interfaces jag vill skicka ut till Statistik sidan.
interface StatisticsData {
  totalPie: PieChartSliceData[];
  chorePies: IndividualChoresPieStats[];
}

// Denna ska skicka ut objektet med all statisticData.
export function getStatisticsData() {
  // DatabasAnrop
  const profiles = mockProfiles;
  // DatabasAnrop
  const completedChores = mockedCompletedByChores;
  // DatabasAnrop
  const chores = mockChores;

  const pieData = mapTotalPieStats(profiles, completedChores, chores);
  const totalPieStats = mapToPieChartSliceDataForTotal(pieData);
  const individualChoresPieStats = getChorePies(
    chores,
    completedChores,
    profiles
  );

  const statisticsData: StatisticsData = {
    totalPie: totalPieStats,
    chorePies: individualChoresPieStats,
  };

  return statisticsData;
}

// Vad gör denna egentligen? Den skapar ett objekt som visar hur många sysslor en avnändare gjort och hur många poäng profilen har totalt.
export function getProfileStatitisticsTotal(
  profile: ProfileDb,
  completedChores: CompletedBy[],
  chores: Chore[]
): ProfileStatisticsTotal | null {
  const listOfcompletedChoresByProfile = completedChores.filter(
    (mc) => mc.profile_id === profile.id
  );

  if (listOfcompletedChoresByProfile.length === 0) return null;

  let valuePoints = 0;

  for (const cm of listOfcompletedChoresByProfile) {
    for (const c of chores) {
      if (cm.chore_id === c.id) {
        valuePoints += c.weight;
      }
    }
  }

  const totalNumberofchoresCompleted = listOfcompletedChoresByProfile.length;

  const profileStatisticsTotal: ProfileStatisticsTotal = {
    profile: profile,
    valuePoints: valuePoints,
    completedCount: totalNumberofchoresCompleted,
  };

  return profileStatisticsTotal;
}

// Vad gör denna funktionen?
// Den Mappar för Totala Pajen
export function mapTotalPieStats(
  profiles: ProfileDb[],
  completedChores: CompletedBy[],
  chores: Chore[]
): TotalPieStats {
  let listOfProfileStatisticsTotal: ProfileStatisticsTotal[] = [];
  let totalChoresDone: number = 0;
  let totalValuePoints: number = 0;
  for (const profile of profiles) {
    const result = getProfileStatitisticsTotal(
      profile,
      completedChores,
      chores
    );
    if (!result) {
      continue;
    }
    listOfProfileStatisticsTotal.push(result);
    totalChoresDone += result.completedCount;
    totalValuePoints += result.valuePoints;
  }

  const pieData: TotalPieStats = {
    numberOfChores: totalChoresDone,
    totalValuePoints: totalValuePoints,
    profileData: listOfProfileStatisticsTotal,
  };
  return pieData;
}

// denna metoden används för att skriva ut Datan som ska visas upp i pajen.
export function mapToPieChartSliceDataForTotal(
  totalPieStats: TotalPieStats
): PieChartSliceData[] {
  let data: PieChartSliceData[] = [];
  let value: number = 0;

  for (const p of totalPieStats.profileData) {
    const color = getColorFromAvatar(p.profile.selectedAvatar);
    const emoji = getEmojiFromAvatar(p.profile.selectedAvatar);
    value = calculateChoresAndValuesForTotal(
      totalPieStats.numberOfChores,
      totalPieStats.totalValuePoints,
      p
    );

    const newData: PieChartSliceData = {
      text: emoji,
      value: value,
      color: color,
    };
    data.push(newData);
  }
  return data;
}

// denna metod ska gå igenom all chores och kolla completed. och returnera en lista med individual.
function getChorePies(
  chores: Chore[],
  completedBy: CompletedBy[],
  profiles: ProfileDb[]
): IndividualChoresPieStats[] {
  const choresPies: IndividualChoresPieStats[] = [];
  for (const c of chores) {
    // Hämta alla completedBy.
    const completedChores = completedBy.filter((cb) => cb.chore_id === c.id);
    // om ingen data finns så skickar vi ändå med ett objekt.
    if (completedChores.length === 0) {
      continue;
    }
    const sliceData: PieChartSliceData[] = createSliceDataForChore(
      completedChores,
      profiles
    );
    if (sliceData.length === 0) {
      continue;
    }
    choresPies.push({
      choreId: c.id,
      choreTitle: c.title,
      sliceData: sliceData,
    });
  }
  return choresPies;
}

function createSliceDataForChore(
  completedChore: CompletedBy[],
  profiles: ProfileDb[]
): PieChartSliceData[] {
  const sliceData: PieChartSliceData[] = [];
  let totalCompletions = 0;

  for (const profile of profiles) {
    const count = completedChore.filter(
      (cc) => cc.profile_id === profile.id
    ).length;
    totalCompletions += count;
  }

  for (const profile of profiles) {
    const count = completedChore.filter(
      (cc) => cc.profile_id === profile.id
    ).length;

    if (count > 0) {
      sliceData.push({
        text: getEmojiFromAvatar(profile.selectedAvatar),
        color: getColorFromAvatar(profile.selectedAvatar),
        value: (count / totalCompletions) * 100,
      });
    }
  }
  return sliceData;
}

function getEmojiFromAvatar(avatarFileName: string): string {
  switch (avatarFileName) {
    case "avatar1.png":
      return "🦊";
    case "avatar2.png":
      return "🐷";
    case "avatar3.png":
      return "🐸";
    case "avatar4.png":
      return "🐤";
    case "avatar5.png":
      return "🐙";
    case "avatar6.png":
      return "🐋";
    case "avatar7.png":
      return "🦉";
    case "avatar8.png":
      return "🦄";
    default:
      return "❓";
  }
}

function getColorFromAvatar(avatarFileName: string): string {
  switch (avatarFileName) {
    case "avatar1.png":
      return "#E67E22";
    case "avatar2.png":
      return "#F8BBD0";
    case "avatar3.png":
      return "#43A047";
    case "avatar4.png":
      return "#FFEB3B";
    case "avatar5.png":
      return "#E57373";
    case "avatar6.png":
      return "#4FC3F7";
    case "avatar7.png":
      return "#8D6E63";
    case "avatar8.png":
      return "#BA68C8";
    default:
      return "#CCCCCC";
  }
}

function calculateChoresAndValuesForTotal(
  chores: number,
  value: number,
  profileData: ProfileStatisticsTotal
) {
  const totalChoresCompletedPercentage: number =
    (profileData.completedCount / chores) * 100;
  const totalValuePointsPercentage: number =
    (profileData.valuePoints / value) * 100;
  const total: number = Math.floor(
    totalChoresCompletedPercentage + totalValuePointsPercentage / 2
  );
  return total;
}
