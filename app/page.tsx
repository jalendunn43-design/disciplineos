import Link from "next/link";

const workflow = [
  {
    title: "Morning check-in",
    text: "Start with sleep, mood, energy, and one clear mission before the day gets noisy."
  },
  {
    title: "Daily habits",
    text: "Check off the actions that matter most and watch your score, XP, and streak move."
  },
  {
    title: "AI coach",
    text: "Get direct feedback that is supportive, honest, and focused on tomorrow's next rep."
  },
  {
    title: "Weekly review",
    text: "See what actually happened, spot the pattern, and adjust the system before drift wins."
  }
];

const stickyReasons = [
  "Streaks make consistency visible.",
  "XP turns effort into momentum.",
  "Personalized habits keep the system yours.",
  "Daily missions make the next action obvious."
];

const testimonials = [
  {
    quote:
      "DisciplineOS made my day feel measurable without making it feel mechanical. I finally know what winning today looks like.",
    name: "Maya R.",
    role: "Founder"
  },
  {
    quote:
      "The streaks and weekly review changed the way I think about consistency. It is quiet, focused pressure in the best way.",
    name: "Andre C.",
    role: "Product designer"
  },
  {
    quote:
      "I stopped waiting to feel motivated. The mission card tells me exactly where to put my first serious block of attention.",
    name: "Jordan L.",
    role: "Builder"
  }
];

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100">
            Discipline that survives real life
          </p>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Become someone who actually follows through.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
            DisciplineOS helps you stay consistent on the days motivation
            disappears.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Track habits, build streaks, earn XP, review your week, and turn
            discipline into identity.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-teal-300 px-6 py-3 text-center font-bold text-slate-950 shadow-[0_0_36px_rgba(45,212,191,0.28)] transition hover:bg-teal-200"
            >
              Start Free
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-xl border border-white/10 bg-slate-950/85 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">
                Today&apos;s mission
              </span>
              <span className="rounded-full bg-teal-300/10 px-3 py-1 text-sm font-bold text-teal-200">
                83/100
              </span>
            </div>
            <div className="rounded-xl border border-teal-300/20 bg-gradient-to-br from-teal-300/15 to-sky-400/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-100/70">
                Priority
              </p>
              <p className="mt-3 text-2xl font-black text-white">
                Protect one focused block before the day starts negotiating.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Your future does not need a louder plan. It needs repeated proof
                that you do what you said you would do.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Streak" value="12 days" />
              <MiniStat label="XP" value="214" />
              <MiniStat label="Level" value="3" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/45 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            The problem
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Motivation fades. Systems win.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Most people know what to do but fail to stay consistent. The hard
            part is not finding another tactic. It is building a system that
            keeps you honest when the mood disappears, the week gets loud, and
            the old version of you wants the day off.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            A daily operating rhythm for follow-through.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-300/10 text-sm font-black text-teal-200">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-xl font-black text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.03] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
              Why people stick with it
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Progress you can feel before the results arrive.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              DisciplineOS gives consistency a shape. You see the streak. You
              earn the XP. You adjust the habit list. You wake up to a mission
              instead of a vague intention.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stickyReasons.map((reason) => (
              <div
                key={reason}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="mb-5 h-2 w-16 rounded-full bg-gradient-to-r from-teal-300 to-sky-400" />
                <p className="text-lg font-bold leading-7 text-white">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Testimonials
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Built for people who are done restarting.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-base leading-7 text-slate-300">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-teal-300/20 bg-gradient-to-br from-teal-300/15 to-sky-400/10 p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Your future is built by what you repeat.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Start with one day. Then another. Let the system turn small promises
            into a new standard.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="rounded-lg bg-teal-300 px-6 py-3 text-center font-bold text-slate-950 shadow-[0_0_36px_rgba(45,212,191,0.28)] transition hover:bg-teal-200"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}
