"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export const goalCategories = [
  "Money",
  "Fitness",
  "Work",
  "Business",
  "Mindset",
  "Health",
  "Custom"
] as const;

export const difficultyLevels = ["Easy", "Medium", "Hard", "Elite"] as const;

export type GoalCategory = (typeof goalCategories)[number];
export type DifficultyLevel = (typeof difficultyLevels)[number];

export type Habit = {
  id: string;
  label: string;
  category: GoalCategory;
  xp: number;
  difficulty: DifficultyLevel;
  recurringDaily: boolean;
};

export type Category = {
  name: GoalCategory;
  score: number;
  tone: string;
  completed: number;
  total: number;
};

export type HabitInput = Omit<Habit, "id">;

export type MorningEntryInput = {
  sleepQuality: number;
  mood: number;
  energyLevel: number;
  mainFocus: string;
};

export type TodaysMission = {
  priority: string;
  risk: string;
  winCondition: string;
  motivation: string;
};

export type MorningEntry = MorningEntryInput & {
  date: string;
  mission: TodaysMission;
  completedAt: string;
};

export type StreakMilestone = {
  days: number;
  label: string;
};

export type StreakStatus = {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
  isRecoveredToday: boolean;
  hasMissedDay: boolean;
  completedToday: boolean;
  activeMilestones: StreakMilestone[];
  nextMilestone: StreakMilestone | null;
};

export type UserProfile = {
  name: string;
  identity: string;
};

export type DisciplineScore = {
  score: number;
  completedPoints: number;
  missedPenalty: number;
  streakBonus: number;
  readinessBonus: number;
  label: string;
  isDanger: boolean;
  dangerMessage: string | null;
};

const defaultHabits: Habit[] = [
  {
    id: "gym",
    label: "Gym or walk",
    category: "Fitness",
    xp: 18,
    difficulty: "Medium",
    recurringDaily: true
  },
  {
    id: "trading",
    label: "Trading plan or review",
    category: "Money",
    xp: 16,
    difficulty: "Hard",
    recurringDaily: true
  },
  {
    id: "coding",
    label: "Coding sprint",
    category: "Work",
    xp: 22,
    difficulty: "Hard",
    recurringDaily: true
  },
  {
    id: "business-work",
    label: "Business/app work",
    category: "Business",
    xp: 20,
    difficulty: "Hard",
    recurringDaily: true
  },
  {
    id: "saving-money",
    label: "No unnecessary spending",
    category: "Money",
    xp: 14,
    difficulty: "Medium",
    recurringDaily: true
  },
  {
    id: "reading",
    label: "Read 20 pages",
    category: "Mindset",
    xp: 12,
    difficulty: "Easy",
    recurringDaily: true
  },
  {
    id: "sleep",
    label: "Sleep 7+ hours",
    category: "Health",
    xp: 14,
    difficulty: "Medium",
    recurringDaily: true
  }
];

const categoryTones: Record<GoalCategory, string> = {
  Money: "from-emerald-400 to-teal-300",
  Fitness: "from-lime-300 to-emerald-400",
  Work: "from-sky-300 to-cyan-300",
  Business: "from-amber-300 to-orange-300",
  Mindset: "from-fuchsia-300 to-rose-300",
  Health: "from-indigo-300 to-sky-300",
  Custom: "from-violet-300 to-teal-300"
};

export const streakMilestones: StreakMilestone[] = [
  { days: 3, label: "Building Momentum" },
  { days: 7, label: "Locked In" },
  { days: 14, label: "Disciplined" },
  { days: 30, label: "Elite" },
  { days: 60, label: "Unstoppable" }
];

type DisciplineContextValue = {
  profile: UserProfile;
  habits: Habit[];
  dailyHabits: Habit[];
  checkedHabitIds: string[];
  checkInHistory: Record<string, string[]>;
  yesterdayMissedHabits: Habit[];
  morningEntries: MorningEntry[];
  todaysMorningEntry: MorningEntry | null;
  todaysMission: TodaysMission | null;
  streakStatus: StreakStatus;
  streakDates: string[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  saveMorningEntry: (entry: MorningEntryInput) => void;
  addHabit: (habit: HabitInput) => void;
  updateHabit: (id: string, habit: HabitInput) => void;
  deleteHabit: (id: string) => void;
  resetHabits: () => void;
  updateProfile: (profile: UserProfile) => void;
  toggleHabit: (id: string) => void;
  resetToday: () => void;
  disciplineScore: DisciplineScore;
  dailyScore: number;
  currentStreak: number;
  level: number;
  xp: number;
  xpForLevel: number;
  xpProgress: number;
  completedCount: number;
  categories: Category[];
};

const DisciplineContext = createContext<DisciplineContextValue | null>(null);

const habitStorageKey = "disciplineos.habits.v1";
const checkInStorageKey = "disciplineos.checkin.v2";
const checkInHistoryStorageKey = "disciplineos.checkin-history.v1";
const morningStorageKey = "disciplineos.morning.v1";
const streakStorageKey = "disciplineos.streak.v1";
const soundStorageKey = "disciplineos.sound.v1";
const profileStorageKey = "disciplineos.profile.v1";
const baseXp = 180;
const xpForLevel = 300;
const defaultProfile: UserProfile = {
  name: "Jalen",
  identity: "Discipline Builder"
};

function getTodayKey() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000
  );

  return localDate.toISOString().slice(0, 10);
}

function getDateKeyFromOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

function getPreviousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

function getYesterdayKey() {
  return getDateKeyFromOffset(-1);
}

function getDayDistance(fromDateKey: string, toDateKey: string) {
  const from = new Date(`${fromDateKey}T12:00:00`).getTime();
  const to = new Date(`${toDateKey}T12:00:00`).getTime();

  return Math.round((to - from) / 86_400_000);
}

function getDefaultStreakDates() {
  return Array.from({ length: 12 }, (_, index) => getDateKeyFromOffset(-index));
}

function getLevel(totalXp: number) {
  return Math.floor(totalXp / xpForLevel) + 3;
}

function createHabitId(label: string) {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "habit"}-${Date.now().toString(36)}`;
}

function clampXp(value: number) {
  if (Number.isNaN(value)) {
    return 10;
  }

  return Math.min(100, Math.max(1, Math.round(value)));
}

function clampRating(value: number) {
  if (Number.isNaN(value)) {
    return 5;
  }

  return Math.min(10, Math.max(1, Math.round(value)));
}

function hashText(text: string) {
  return text.split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) % 9973;
  }, 7);
}

function pickDaily<T>(items: T[], seed: string, offset = 0) {
  return items[(hashText(seed) + offset) % items.length];
}

function generateMission(
  entry: MorningEntryInput,
  missedHabitsYesterday: Habit[] = [],
  dateKey = getTodayKey()
): TodaysMission {
  const sleep = clampRating(entry.sleepQuality);
  const mood = clampRating(entry.mood);
  const energy = clampRating(entry.energyLevel);
  const focus = entry.mainFocus.trim() || "Protect one meaningful win";
  const average = Math.round((sleep + mood + energy) / 3);
  const missedFocus =
    missedHabitsYesterday[0]?.label || "your first daily habit";
  const seed = `${dateKey}-${sleep}-${mood}-${energy}-${focus}-${missedFocus}`;

  const weakestArea =
    sleep <= mood && sleep <= energy
      ? "sleep"
      : mood <= sleep && mood <= energy
        ? "mood"
        : "energy";

  const riskMap: Record<string, string[]> = {
    sleep: [
      "Low recovery could make easy distractions feel deserved. Keep the plan smaller and protect your evening.",
      "Sleep debt may create false urgency. Do the essential work before adding optional battles.",
      "Your body may ask for shortcuts today. Answer with a clean schedule, not extra intensity."
    ],
    mood: [
      "Mood could color the whole scoreboard. Do not negotiate with the first bad feeling.",
      "Emotional drag may make avoidance sound reasonable. Use the list, not the weather in your head.",
      "If frustration spikes, you may abandon structure. Slow down and complete the next visible rep."
    ],
    energy: [
      "Energy is the scarce resource. Spend the first strong block on the mission, not reactive noise.",
      "A late start could drain the day. Put the highest-value work before messages and errands.",
      "If you wait to feel ready, the window may close. Begin with a short, protected block."
    ]
  };

  const priorityOptions =
    missedHabitsYesterday.length > 0
      ? [
          `Lead with ${focus}, then recover yesterday's missed habit: ${missedFocus}.`,
          `Protect ${focus} first and make ${missedFocus} non-negotiable today.`,
          `Win the morning with ${focus}; close the loop that slipped yesterday: ${missedFocus}.`
        ]
      : [
          `Make ${focus} the first meaningful win of the day.`,
          `Protect a clean block for ${focus} before the day gets loud.`,
          `Anchor the day around ${focus} and keep the rest simple.`
        ];

  const winConditionOptions = [
    `Complete ${focus} plus at least ${Math.max(1, missedHabitsYesterday.length || 2)} daily habit${missedHabitsYesterday.length === 1 ? "" : "s"}.`,
    `Finish one focused block on ${focus} and check off the next visible habit without delay.`,
    `End the day with the priority complete and no avoidable miss in ${missedFocus}.`
  ];

  const motivationOptions =
    average >= 8
      ? [
          "You have strong internal weather today. Spend it on the work that compounds.",
          "This is a high-capacity day. Use it with precision, not noise.",
          "When the system gives you energy, convert it into proof."
        ]
      : average >= 5
        ? [
            "You do not need a perfect state. You need one clean block of execution.",
            "Average energy is enough when the target is clear.",
            "Steady beats dramatic today. Keep the promise and move."
          ]
        : [
            "Lower the friction, keep the promise small, and earn momentum one rep at a time.",
            "Today is about control, not heroics. Make the next right action easy.",
            "A hard day still counts when you refuse to disappear."
          ];

  return {
    priority: pickDaily(priorityOptions, seed),
    risk: pickDaily(riskMap[weakestArea], seed, 1),
    winCondition: pickDaily(winConditionOptions, seed, 2),
    motivation: pickDaily(motivationOptions, seed, 3)
  };
}

function readStoredHabits() {
  const saved = window.localStorage.getItem(habitStorageKey);

  if (!saved) {
    return defaultHabits;
  }

  try {
    const parsed = JSON.parse(saved) as Habit[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultHabits;
    }

    return parsed.map((habit) => ({
      id: String(habit.id),
      label: String(habit.label || "Untitled habit"),
      category: goalCategories.includes(habit.category)
        ? habit.category
        : "Custom",
      xp: clampXp(Number(habit.xp)),
      difficulty: difficultyLevels.includes(habit.difficulty)
        ? habit.difficulty
        : "Medium",
      recurringDaily: Boolean(habit.recurringDaily)
    }));
  } catch {
    return defaultHabits;
  }
}

function readStoredCheckIn() {
  const saved = window.localStorage.getItem(checkInStorageKey);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as string[];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function readStoredCheckInHistory() {
  const saved = window.localStorage.getItem(checkInHistoryStorageKey);

  if (!saved) {
    return {};
  }

  try {
    const parsed = JSON.parse(saved) as Record<string, string[]>;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([dateKey, habitIds]) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && Array.isArray(habitIds);
        })
        .map(([dateKey, habitIds]) => [
          dateKey,
          [...new Set(habitIds.map(String))]
        ])
    );
  } catch {
    return {};
  }
}

function readStoredMorningEntries() {
  const saved = window.localStorage.getItem(morningStorageKey);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as MorningEntry[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((entry) => {
      const input = {
        sleepQuality: clampRating(Number(entry.sleepQuality)),
        mood: clampRating(Number(entry.mood)),
        energyLevel: clampRating(Number(entry.energyLevel)),
        mainFocus: String(entry.mainFocus || "")
      };

      return {
        ...input,
        date: String(entry.date || getTodayKey()),
        mission: normalizeMission(entry.mission, input, entry.date),
        completedAt: String(entry.completedAt || new Date().toISOString())
      };
    });
  } catch {
    return [];
  }
}

function normalizeMission(
  mission: Partial<TodaysMission> & {
    topPriority?: string;
    warning?: string;
  } | undefined,
  input: MorningEntryInput,
  dateKey: string
) {
  if (mission?.priority && mission.risk && mission.winCondition) {
    return {
      priority: String(mission.priority),
      risk: String(mission.risk),
      winCondition: String(mission.winCondition),
      motivation: String(mission.motivation || generateMission(input).motivation)
    };
  }

  if (mission?.topPriority || mission?.warning || mission?.motivation) {
    const generated = generateMission(input, [], dateKey);

    return {
      priority: String(mission.topPriority || generated.priority),
      risk: String(mission.warning || generated.risk),
      winCondition: generated.winCondition,
      motivation: String(mission.motivation || generated.motivation)
    };
  }

  return generateMission(input, [], dateKey);
}

function readStoredStreakDates() {
  const saved = window.localStorage.getItem(streakStorageKey);

  if (!saved) {
    return getDefaultStreakDates();
  }

  try {
    const parsed = JSON.parse(saved) as string[];

    if (!Array.isArray(parsed)) {
      return getDefaultStreakDates();
    }

    return [...new Set(parsed.map(String))]
      .filter((dateKey) => /^\d{4}-\d{2}-\d{2}$/.test(dateKey))
      .sort()
      .reverse();
  } catch {
    return getDefaultStreakDates();
  }
}

function readStoredSoundEnabled() {
  return window.localStorage.getItem(soundStorageKey) === "true";
}

function readStoredProfile() {
  const saved = window.localStorage.getItem(profileStorageKey);

  if (!saved) {
    return defaultProfile;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<UserProfile>;
    const name = String(parsed.name || defaultProfile.name).trim();
    const identity = String(parsed.identity || defaultProfile.identity).trim();

    return {
      name: name || defaultProfile.name,
      identity: identity || defaultProfile.identity
    };
  } catch {
    return defaultProfile;
  }
}

function countConsecutiveDates(dateSet: Set<string>, anchorDateKey: string) {
  let count = 0;
  let cursor = anchorDateKey;

  while (dateSet.has(cursor)) {
    count += 1;
    cursor = getPreviousDateKey(cursor);
  }

  return count;
}

function getLongestStreak(streakDates: string[]) {
  const dateSet = new Set(streakDates);

  return streakDates.reduce((longest, dateKey) => {
    return Math.max(longest, countConsecutiveDates(dateSet, dateKey));
  }, 0);
}

function getStreakStatus(streakDates: string[]): StreakStatus {
  const todayKey = getTodayKey();
  const yesterdayKey = getDateKeyFromOffset(-1);
  const dateSet = new Set(streakDates);
  const completedToday = dateSet.has(todayKey);
  const anchorDateKey = completedToday
    ? todayKey
    : dateSet.has(yesterdayKey)
      ? yesterdayKey
      : null;
  const current = anchorDateKey
    ? countConsecutiveDates(dateSet, anchorDateKey)
    : 0;
  const sortedDates = [...dateSet].sort().reverse();
  const lastCompletedDate = sortedDates[0] || null;
  const previousCompletedDate = sortedDates.find(
    (dateKey) => dateKey !== todayKey
  );
  const hasMissedDay = Boolean(
    !completedToday &&
      lastCompletedDate &&
      getDayDistance(lastCompletedDate, todayKey) > 1
  );
  const isRecoveredToday = Boolean(
    completedToday &&
      previousCompletedDate &&
      getDayDistance(previousCompletedDate, todayKey) > 1
  );
  const activeMilestones = streakMilestones.filter(
    (milestone) => current >= milestone.days
  );
  const nextMilestone =
    streakMilestones.find((milestone) => current < milestone.days) || null;

  return {
    current,
    longest: getLongestStreak(sortedDates),
    lastCompletedDate,
    isRecoveredToday,
    hasMissedDay,
    completedToday,
    activeMilestones,
    nextMilestone
  };
}

function getDisciplineScore({
  dailyScore,
  completedCount,
  dailyHabitsCount,
  streak,
  morningEntry
}: {
  dailyScore: number;
  completedCount: number;
  dailyHabitsCount: number;
  streak: StreakStatus;
  morningEntry: MorningEntry | null;
}): DisciplineScore {
  const missedCount = Math.max(0, dailyHabitsCount - completedCount);
  const completedPoints =
    dailyHabitsCount === 0
      ? 0
      : Math.round((completedCount / dailyHabitsCount) * 70);
  const missedPenalty = missedCount * 5;
  const streakBonus = Math.min(15, Math.floor(streak.current / 3) * 3);
  const readinessBonus = morningEntry
    ? Math.min(
        15,
        Math.round(
          ((morningEntry.sleepQuality +
            morningEntry.mood +
            morningEntry.energyLevel) /
            3) *
            1.5
        )
      )
    : 0;
  const score = Math.min(
    100,
    Math.max(0, completedPoints + streakBonus + readinessBonus - missedPenalty)
  );
  const isDanger =
    dailyScore < 50 ||
    (dailyHabitsCount > 0 && missedCount >= Math.ceil(dailyHabitsCount / 2));
  const label =
    score >= 85
      ? "Identity locked"
      : score >= 70
        ? "Pressure handled"
        : score >= 50
          ? "Needs protection"
          : "Recovery required";

  return {
    score,
    completedPoints,
    missedPenalty,
    streakBonus,
    readinessBonus,
    label,
    isDanger,
    dangerMessage: isDanger
      ? "WARNING: Your streak is at risk. Recovery move: complete one small habit now."
      : null
  };
}

export function DisciplineProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [checkedHabitIds, setCheckedHabitIds] = useState<string[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<Record<string, string[]>>(
    {}
  );
  const [morningEntries, setMorningEntries] = useState<MorningEntry[]>([]);
  const [streakDates, setStreakDates] = useState<string[]>(
    getDefaultStreakDates()
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readStoredProfile());
    setHabits(readStoredHabits());
    setCheckedHabitIds(readStoredCheckIn());
    setCheckInHistory(readStoredCheckInHistory());
    setMorningEntries(readStoredMorningEntries());
    setStreakDates(readStoredStreakDates());
    setSoundEnabled(readStoredSoundEnabled());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    }
  }, [hydrated, profile]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(habitStorageKey, JSON.stringify(habits));
    }
  }, [habits, hydrated]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(
        checkInStorageKey,
        JSON.stringify(checkedHabitIds)
      );
      const todayKey = getTodayKey();
      setCheckInHistory((current) => ({
        ...current,
        [todayKey]: checkedHabitIds
      }));
    }
  }, [checkedHabitIds, hydrated]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(
        checkInHistoryStorageKey,
        JSON.stringify(checkInHistory)
      );
    }
  }, [checkInHistory, hydrated]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(
        morningStorageKey,
        JSON.stringify(morningEntries)
      );
    }
  }, [hydrated, morningEntries]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(streakStorageKey, JSON.stringify(streakDates));
    }
  }, [hydrated, streakDates]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(soundStorageKey, String(soundEnabled));
    }
  }, [hydrated, soundEnabled]);

  const dailyHabits = useMemo(
    () => habits.filter((habit) => habit.recurringDaily),
    [habits]
  );

  const activeCheckedHabitIds = useMemo(() => {
    const dailyIds = new Set(dailyHabits.map((habit) => habit.id));
    return checkedHabitIds.filter((id) => dailyIds.has(id));
  }, [checkedHabitIds, dailyHabits]);

  const completedCount = activeCheckedHabitIds.length;
  const dailyScore =
    dailyHabits.length === 0
      ? 0
      : Math.round((completedCount / dailyHabits.length) * 100);
  const earnedXp = dailyHabits
    .filter((habit) => activeCheckedHabitIds.includes(habit.id))
    .reduce((sum, habit) => sum + habit.xp, 0);
  const xp = baseXp + earnedXp;
  const level = getLevel(xp);
  const xpProgress = Math.round(((xp % xpForLevel) / xpForLevel) * 100);

  useEffect(() => {
    if (!hydrated || dailyHabits.length === 0) {
      return;
    }

    if (completedCount === dailyHabits.length) {
      const todayKey = getTodayKey();
      setStreakDates((current) =>
        current.includes(todayKey) ? current : [todayKey, ...current]
      );
    }
  }, [completedCount, dailyHabits.length, hydrated]);

  const categories = useMemo<Category[]>(() => {
    return goalCategories.map((name) => {
      const categoryHabits = dailyHabits.filter(
        (habit) => habit.category === name
      );
      const completed = categoryHabits.filter((habit) =>
        activeCheckedHabitIds.includes(habit.id)
      ).length;
      const score =
        categoryHabits.length === 0
          ? 0
          : Math.round((completed / categoryHabits.length) * 100);

      return {
        name,
        score,
        completed,
        total: categoryHabits.length,
        tone: categoryTones[name]
      };
    });
  }, [activeCheckedHabitIds, dailyHabits]);

  const yesterdayMissedHabits = useMemo(() => {
    const yesterdayKey = getYesterdayKey();

    if (!Object.prototype.hasOwnProperty.call(checkInHistory, yesterdayKey)) {
      return [];
    }

    const checkedYesterday = new Set(checkInHistory[yesterdayKey] || []);

    return dailyHabits.filter((habit) => !checkedYesterday.has(habit.id));
  }, [checkInHistory, dailyHabits]);

  const todaysMorningEntry = useMemo(() => {
    const todayKey = getTodayKey();
    return morningEntries.find((entry) => entry.date === todayKey) || null;
  }, [morningEntries]);

  const todaysMission = todaysMorningEntry?.mission || null;
  const streakStatus = useMemo(
    () => getStreakStatus(streakDates),
    [streakDates]
  );
  const disciplineScore = useMemo(
    () =>
      getDisciplineScore({
        dailyScore,
        completedCount,
        dailyHabitsCount: dailyHabits.length,
        streak: streakStatus,
        morningEntry: todaysMorningEntry
      }),
    [
      completedCount,
      dailyHabits.length,
      dailyScore,
      streakStatus,
      todaysMorningEntry
    ]
  );

  const value = useMemo<DisciplineContextValue>(
    () => ({
      profile,
      habits,
      dailyHabits,
      checkedHabitIds: activeCheckedHabitIds,
      checkInHistory,
      yesterdayMissedHabits,
      morningEntries,
      todaysMorningEntry,
      todaysMission,
      streakStatus,
      streakDates,
      soundEnabled,
      setSoundEnabled,
      updateProfile: (nextProfile) => {
        setProfile({
          name: nextProfile.name,
          identity: nextProfile.identity
        });
      },
      saveMorningEntry: (entry) => {
        const input = {
          sleepQuality: clampRating(entry.sleepQuality),
          mood: clampRating(entry.mood),
          energyLevel: clampRating(entry.energyLevel),
          mainFocus: entry.mainFocus.trim()
        };
        const todayKey = getTodayKey();
        const morningEntry: MorningEntry = {
          ...input,
          date: todayKey,
          mission: generateMission(input, yesterdayMissedHabits, todayKey),
          completedAt: new Date().toISOString()
        };

        setMorningEntries((current) => [
          morningEntry,
          ...current.filter((item) => item.date !== todayKey)
        ]);
      },
      addHabit: (habit) => {
        setHabits((current) => [
          ...current,
          {
            ...habit,
            id: createHabitId(habit.label),
            label: habit.label.trim() || "Untitled habit",
            xp: clampXp(habit.xp)
          }
        ]);
      },
      updateHabit: (id, habit) => {
        setHabits((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...habit,
                  id,
                  label: habit.label.trim() || "Untitled habit",
                  xp: clampXp(habit.xp)
                }
              : item
          )
        );
      },
      deleteHabit: (id) => {
        setHabits((current) => current.filter((habit) => habit.id !== id));
        setCheckedHabitIds((current) =>
          current.filter((habitId) => habitId !== id)
        );
      },
      resetHabits: () => {
        setHabits(defaultHabits);
        setCheckedHabitIds([]);
      },
      toggleHabit: (id) => {
        setCheckedHabitIds((current) =>
          current.includes(id)
            ? current.filter((habitId) => habitId !== id)
            : [...current, id]
        );
      },
      resetToday: () => {
        const todayKey = getTodayKey();
        setCheckedHabitIds([]);
        setCheckInHistory((current) => ({
          ...current,
          [todayKey]: []
        }));
        setStreakDates((current) =>
          current.filter((dateKey) => dateKey !== todayKey)
        );
      },
      disciplineScore,
      dailyScore,
      currentStreak: streakStatus.current,
      level,
      xp,
      xpForLevel,
      xpProgress,
      completedCount,
      categories
    }),
    [
      activeCheckedHabitIds,
      categories,
      checkInHistory,
      completedCount,
      dailyHabits,
      dailyScore,
      disciplineScore,
      habits,
      level,
      morningEntries,
      profile,
      soundEnabled,
      streakDates,
      streakStatus,
      todaysMission,
      todaysMorningEntry,
      yesterdayMissedHabits,
      xp,
      xpProgress
    ]
  );

  return (
    <DisciplineContext.Provider value={value}>
      {children}
    </DisciplineContext.Provider>
  );
}

export function useDiscipline() {
  const context = useContext(DisciplineContext);

  if (!context) {
    throw new Error("useDiscipline must be used within DisciplineProvider");
  }

  return context;
}
