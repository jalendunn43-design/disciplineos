"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  difficultyLevels,
  goalCategories,
  type DifficultyLevel,
  type GoalCategory,
  type Habit,
  type HabitInput,
  useDiscipline
} from "@/components/discipline-state";

const emptyHabit: HabitInput = {
  label: "",
  category: "Custom",
  xp: 10,
  difficulty: "Medium",
  recurringDaily: true
};

export function SettingsView() {
  const {
    profile,
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    resetHabits,
    updateProfile,
    soundEnabled,
    setSoundEnabled
  } = useDiscipline();
  const [draft, setDraft] = useState<HabitInput>(emptyHabit);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.label.trim()) {
      return;
    }

    addHabit(draft);
    setDraft(emptyHabit);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Settings
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Personalize the system.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Create the daily goals that fit your life: gym, trading, coding,
            business work, saving money, reading, health, mindset, or custom
            habits.
          </p>
        </div>
        <button
          type="button"
          onClick={resetHabits}
          className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          Reset Defaults
        </button>
      </div>

      <section className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-teal-300/10 via-slate-950/80 to-cyan-400/8 p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-white">Profile Identity</h2>
          <p className="mt-1 text-sm text-slate-400">
            This powers the dashboard identity card and stays saved on this
            device.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display name">
            <input
              value={profile.name}
              onChange={(event) =>
                updateProfile({ ...profile, name: event.target.value })
              }
              placeholder="Jalen"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60"
            />
          </Field>
          <Field label="Identity title">
            <input
              value={profile.identity}
              onChange={(event) =>
                updateProfile({ ...profile, identity: event.target.value })
              }
              placeholder="Discipline Builder"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60"
            />
          </Field>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6"
      >
        <div className="mb-5">
          <h2 className="text-2xl font-black text-white">Create Habit</h2>
          <p className="mt-1 text-sm text-slate-400">
            Set the reward, category, difficulty, and whether it appears in your
            daily check-in.
          </p>
        </div>
        <HabitFields habit={draft} onChange={setDraft} />
        <button
          type="submit"
          className="mt-5 rounded-lg bg-teal-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-200"
        >
          Add Habit
        </button>
      </form>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Completion Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Subtle completion sound is off by default. Visual rewards always
              stay on.
            </p>
          </div>
          <label className="flex w-fit items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.target.checked)}
              className="h-5 w-5 rounded border-white/20 bg-slate-950 accent-teal-300"
            />
            Sound {soundEnabled ? "On" : "Off"}
          </label>
        </div>
      </section>

      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-white">Your Habits</h2>
          <span className="text-sm text-slate-500">
            {habits.length} local habits saved
          </span>
        </div>

        <div className="space-y-4">
          {habits.map((habit) => (
            <EditableHabit
              key={habit.id}
              habit={habit}
              onChange={(nextHabit) => updateHabit(habit.id, nextHabit)}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditableHabit({
  habit,
  onChange,
  onDelete
}: {
  habit: Habit;
  onChange: (habit: HabitInput) => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-white">{habit.label}</h3>
          <p className="text-sm text-slate-500">
            {habit.category} - {habit.difficulty} - {habit.xp} XP
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-rose-300/20 px-4 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10"
        >
          Delete
        </button>
      </div>
      <HabitFields habit={habit} onChange={onChange} compact />
    </article>
  );
}

function HabitFields({
  habit,
  onChange,
  compact = false
}: {
  habit: HabitInput;
  onChange: (habit: HabitInput) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid gap-4 ${
        compact ? "lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr]" : "lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr]"
      }`}
    >
      <Field label="Habit name">
        <input
          value={habit.label}
          onChange={(event) =>
            onChange({ ...habit, label: event.target.value })
          }
          placeholder="Gym, trading, coding..."
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60"
        />
      </Field>

      <Field label="Category">
        <select
          value={habit.category}
          onChange={(event) =>
            onChange({
              ...habit,
              category: event.target.value as GoalCategory
            })
          }
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-teal-300/60"
        >
          {goalCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Difficulty">
        <select
          value={habit.difficulty}
          onChange={(event) =>
            onChange({
              ...habit,
              difficulty: event.target.value as DifficultyLevel
            })
          }
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-teal-300/60"
        >
          {difficultyLevels.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </Field>

      <Field label="XP reward">
        <input
          type="number"
          min={1}
          max={100}
          value={habit.xp}
          onChange={(event) =>
            onChange({ ...habit, xp: Number(event.target.value) })
          }
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-teal-300/60"
        />
      </Field>

      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm font-bold text-slate-300">
        <input
          type="checkbox"
          checked={habit.recurringDaily}
          onChange={(event) =>
            onChange({ ...habit, recurringDaily: event.target.checked })
          }
          className="h-5 w-5 rounded border-white/20 bg-slate-950 accent-teal-300"
        />
        Daily
      </label>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
