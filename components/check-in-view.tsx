"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ProgressBar } from "@/components/progress-bar";
import { useDiscipline } from "@/components/discipline-state";
import { RecoveryPanel, StreakPanel } from "@/components/streak-panel";

const encouragements = [
  "Momentum built.",
  "1% better.",
  "Keep stacking wins.",
  "You showed up."
];

type XpPopup = {
  id: string;
  habitId: string;
  xp: number;
};

export function CheckInView() {
  const {
    dailyHabits,
    checkedHabitIds,
    toggleHabit,
    resetToday,
    dailyScore,
    xp,
    xpForLevel,
    xpProgress,
    level,
    completedCount,
    streakStatus,
    disciplineScore,
    soundEnabled
  } = useDiscipline();
  const [xpPopups, setXpPopups] = useState<XpPopup[]>([]);
  const [completionMessage, setCompletionMessage] = useState("");
  const [scoreGlow, setScoreGlow] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [streakPulse, setStreakPulse] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  function playCompletionSound() {
    if (!soundEnabled || typeof window === "undefined") {
      return;
    }

    const AudioContextConstructor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context =
      audioContextRef.current || new AudioContextConstructor();
    audioContextRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      880,
      context.currentTime + 0.08
    );
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  }

  function handleToggle(habitId: string, habitXp: number) {
    const wasChecked = checkedHabitIds.includes(habitId);

    toggleHabit(habitId);

    if (wasChecked) {
      return;
    }

    const nextCompletedCount = completedCount + 1;
    const popupId = `${habitId}-${Date.now()}`;
    const message =
      encouragements[(nextCompletedCount - 1) % encouragements.length];
    const completingDay =
      dailyHabits.length > 0 && nextCompletedCount === dailyHabits.length;

    setXpPopups((current) => [...current, { id: popupId, habitId, xp: habitXp }]);
    setCompletionMessage(message);
    setScoreGlow(true);
    playCompletionSound();

    window.setTimeout(() => {
      setXpPopups((current) => current.filter((popup) => popup.id !== popupId));
    }, 900);
    window.setTimeout(() => setScoreGlow(false), 850);

    if (completingDay) {
      setConfettiKey((current) => current + 1);
      setStreakPulse(true);
      window.setTimeout(() => setStreakPulse(false), 1200);
    }
  }

  function handleResetToday() {
    resetToday();
    setXpPopups([]);
    setCompletionMessage("");
    setScoreGlow(false);
    setStreakPulse(false);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
          Daily Check-In
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Make the scoreboard honest.
        </h1>
        <p className="mt-4 text-slate-400">
          Check what you actually did today. Each personalized goal raises your
          score, adds XP, and pushes your level progress forward.
        </p>

        <div
          className={`premium-card mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-500 ${
            scoreGlow ? "completion-score-glow" : ""
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            <Metric
              label="Score"
              value={`${dailyScore}/100`}
              pulse={scoreGlow}
            />
            <Metric label="Level" value={`${level}`} />
            <Metric label="XP" value={`${xp}`} />
            <Metric
              label="Done"
              value={`${completedCount}/${dailyHabits.length}`}
            />
          </div>
          <div className="mt-6">
            <div className="mb-3 flex justify-between text-sm text-slate-400">
              <span>Level progress</span>
              <span>
                {xp % xpForLevel}/{xpForLevel} XP
              </span>
            </div>
            <ProgressBar value={xpProgress} />
          </div>
        </div>

        {completionMessage ? (
          <div className="completion-message mt-4 rounded-xl border border-teal-300/20 bg-teal-300/10 px-4 py-3 text-sm font-bold text-teal-100">
            {completionMessage}
          </div>
        ) : null}

        {disciplineScore.dangerMessage ? (
          <div className="danger-pulse mt-4 rounded-xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm font-bold leading-6 text-rose-100">
            {disciplineScore.dangerMessage}
          </div>
        ) : null}
      </aside>

      <div className="space-y-6">
        {streakStatus.hasMissedDay ? (
          <RecoveryPanel streak={streakStatus} />
        ) : (
          <StreakPanel streak={streakStatus} celebration={streakPulse} />
        )}

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-6">
          {confettiKey > 0 ? <Confetti key={confettiKey} /> : null}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Today&apos;s tasks
              </h2>
              <p className="text-sm text-slate-400">
                Recurring habits pulled from your Settings page.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/settings"
                className="rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-bold text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Edit Habits
              </Link>
              <button
                type="button"
                onClick={handleResetToday}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {dailyHabits.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-slate-300">
              No recurring daily habits yet. Add one in Settings to build your
              daily scoreboard.
            </div>
          ) : (
            <div className="space-y-3">
              {dailyHabits.map((habit) => {
                const checked = checkedHabitIds.includes(habit.id);
                const popup = xpPopups.find(
                  (item) => item.habitId === habit.id
                );

                return (
                  <label
                    key={habit.id}
                    className={`completion-row relative flex cursor-pointer flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center ${
                      checked
                        ? "completion-row-done border-teal-300/40 bg-teal-300/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(habit.id, habit.xp)}
                      className="sr-only"
                    />
                    <span
                      className={`completion-check h-6 w-6 shrink-0 rounded-md border ${
                        checked
                          ? "border-teal-300 bg-teal-300"
                          : "border-white/20 bg-slate-950"
                      }`}
                      aria-hidden="true"
                    >
                      <span className="completion-check-mark" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-white">
                        {habit.label}
                      </span>
                      <span className="text-sm text-slate-400">
                        {habit.category} - {habit.difficulty} - +{habit.xp} XP
                      </span>
                    </span>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                        checked
                          ? "bg-teal-300 text-slate-950"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {checked ? "DONE" : "OPEN"}
                    </span>
                    {popup ? (
                      <span className="xp-pop" aria-hidden="true">
                        +{popup.xp} XP
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Confetti() {
  return (
    <div className="completion-confetti" aria-hidden="true">
      {Array.from({ length: 22 }, (_, index) => (
        <span
          key={index}
          style={
            {
              "--x": `${8 + ((index * 11) % 84)}%`,
              "--delay": `${(index % 7) * 45}ms`,
              "--spin": `${index % 2 === 0 ? 1 : -1}`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  pulse = false
}: {
  label: string;
  value: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-black text-white ${
          pulse ? "score-number-pop" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
