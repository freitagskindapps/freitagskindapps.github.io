"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Confetti,
  Crosshair,
  EnvelopeSimple,
  LockSimple,
} from "@phosphor-icons/react";

/* ----------------------------------------------------------------
   Motion primitives
   ---------------------------------------------------------------- */

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/* Button that physically pulls toward the cursor (desktop only) */
function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.2);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ----------------------------------------------------------------
   App-UI vignettes — perpetual motion, isolated so the ticking
   second never re-renders the page around it
   ---------------------------------------------------------------- */

const tasks = [
  { label: "Morning run", done: true },
  { label: "Call grandma", done: true },
  { label: "Water the ficus", done: false },
];

const TodayCard = memo(function TodayCard() {
  return (
    <div className="w-72 rounded-[1.75rem] border border-zinc-200/70 bg-white p-6 shadow-[0_24px_48px_-20px_rgba(120,80,20,0.14)]">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          Today
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      </div>
      <ul className="mt-5 space-y-3.5">
        {tasks.map((t) => (
          <li key={t.label} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                t.done
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-zinc-300 bg-white"
              }`}
            >
              {t.done && <Check size={11} weight="bold" />}
            </span>
            <span
              className={`text-sm ${
                t.done ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-700"
              }`}
            >
              {t.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 h-1 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full w-[66%] rounded-full bg-amber-500/80" />
      </div>
    </div>
  );
});

/* a focus timer counting down from 25:00 on a loop */
const FocusWidget = memo(function FocusWidget() {
  const [remaining, setRemaining] = useState(24 * 60 + 53);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 0 ? 25 * 60 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = 100 - (remaining / (25 * 60)) * 100;

  return (
    <div className="w-48 rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_18px_36px_-18px_rgba(120,80,20,0.12)]">
      <p className="text-xs font-medium text-zinc-500">Focus session</p>
      <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-3xl font-semibold tabular-nums tracking-tight text-zinc-900">
        {minutes}:{String(seconds).padStart(2, "0")}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-amber-500/70 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

function HeroVisual() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const slow = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fast = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div ref={ref} className="relative hidden h-[480px] lg:block" aria-hidden>
      <motion.div
        style={{ y: slow }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-4 top-10 rotate-[-2deg]"
      >
        <TodayCard />
      </motion.div>
      <motion.div
        style={{ y: fast }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute right-2 top-44 rotate-[2.5deg]"
      >
        <FocusWidget />
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-16 left-24 rotate-[1deg]"
      >
        <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/70 bg-white py-2.5 pl-3 pr-5 shadow-[0_14px_28px_-14px_rgba(120,80,20,0.12)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50">
            <Confetti size={15} className="text-amber-600" />
          </span>
          <span className="text-sm text-zinc-600">
            12-day streak
            <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-xs text-zinc-400">
              keep going
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Page
   ---------------------------------------------------------------- */

const features = [
  {
    icon: Crosshair,
    title: "One thing, done well",
    body: "Every app starts with a single problem worth solving — and stops before it becomes a chore to use.",
  },
  {
    icon: Confetti,
    title: "Fun to use",
    body: "Useful should also be delightful. Friendly details, small moments of joy — tools you actually look forward to opening.",
  },
  {
    icon: LockSimple,
    title: "Private by design",
    body: "Your data stays on your device. No accounts, no tracking, nothing phoning home.",
  },
];

const principles = [
  {
    title: "Calm over clever",
    body: "The best interface is one you stop noticing. We build tools that serve their purpose and step aside.",
  },
  {
    title: "No tricks",
    body: "No dark patterns. No false urgency. No confusing defaults. Honest software that does what it says.",
  },
  {
    title: "Made with care",
    body: "A small team, working slowly and deliberately. We ship when something is ready — not when a roadmap says so.",
  },
];

export default function Classic() {
  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8] text-zinc-900 [font-family:var(--font-geist-sans),system-ui,sans-serif]">
      {/* ---------- nav ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/60 bg-[#FAFAF8]/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
              <span className="h-1 w-3 rounded-full bg-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              freitagskind <span className="font-normal text-zinc-500">apps</span>
            </span>
          </a>
          <div className="flex items-center gap-7">
            <a
              href="#apps"
              className="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:block"
            >
              Apps
            </a>
            <a
              href="#studio"
              className="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:block"
            >
              Studio
            </a>
            <a
              href="#contact"
              className="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:block"
            >
              Contact
            </a>
            <span className="hidden h-4 w-px bg-zinc-200 sm:block" />
            <a
              href="/"
              className="group inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              3D island
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </nav>
      </header>

      {/* ---------- hero ---------- */}
      <section id="top" className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 lg:px-10 lg:pt-44">
        <div className="grid items-center gap-16 lg:grid-cols-[7fr_5fr]">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p
              variants={fadeUp}
              className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.2em] text-zinc-400"
            >
              Independent app studio
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-xl text-5xl font-semibold leading-none tracking-tighter md:text-6xl"
            >
              Small apps,
              <br />
              <span className="text-zinc-400">built with intent.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-[48ch] text-base leading-relaxed text-zinc-600"
            >
              We design and build focused mobile apps — one problem, one
              honest solution, every pixel earning its place. No feature
              bloat, no dark patterns, nothing you have to fight.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticLink
                href="#apps"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                See what we make
                <ArrowRight size={15} />
              </MagneticLink>
              <a
                href="#contact"
                className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Say hello
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          </motion.div>

          <HeroVisual />
        </div>
      </section>

      {/* ---------- apps ---------- */}
      <section id="apps" className="border-y border-zinc-200/60 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[2fr_3fr] lg:gap-24">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p
                variants={fadeUp}
                className="font-[family-name:var(--font-geist-mono)] text-sm text-amber-600"
              >
                01
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-4 text-4xl font-semibold tracking-tighter"
              >
                Apps that are fun
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-lg text-zinc-400">
                Joy, shipped.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-[44ch] leading-relaxed text-zinc-600"
              >
                We make small mobile apps with real impact — problem-first
                thinking, simple by design, made to last. The first one is in
                the works.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
                <span className="rounded-full border border-zinc-200 px-3.5 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs text-zinc-500">
                  iOS
                </span>
                <span className="rounded-full bg-amber-50 px-3.5 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs text-amber-700">
                  First app in development
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="divide-y divide-zinc-200/70 border-t border-zinc-200/70 lg:mt-2"
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="group flex gap-6 py-8 transition-colors"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-105">
                    <f.icon size={19} />
                  </span>
                  <div>
                    <h3 className="font-medium text-zinc-900">{f.title}</h3>
                    <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-zinc-500">
                      {f.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- principles ---------- */}
      <section id="studio" className="mx-auto max-w-[1200px] px-6 py-28 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[2fr_3fr] lg:gap-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p
              variants={fadeUp}
              className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.2em] text-zinc-400"
            >
              How we work
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tighter md:text-4xl"
            >
              Self-funded, human-centered, deliberately small.
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="divide-y divide-zinc-200/70 border-t border-zinc-200/70"
          >
            {principles.map((p, i) => (
              <motion.div key={p.title} variants={fadeUp} className="grid gap-2 py-8 sm:grid-cols-[80px_1fr]">
                <span className="font-[family-name:var(--font-geist-mono)] text-sm text-amber-600">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-zinc-900">{p.title}</h3>
                  <p className="mt-1.5 max-w-[56ch] text-[15px] leading-relaxed text-zinc-500">
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- contact ---------- */}
      <section id="contact" className="border-t border-zinc-200/60 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid items-end gap-12 lg:grid-cols-[3fr_2fr]"
          >
            <div>
              <motion.p
                variants={fadeUp}
                className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.2em] text-zinc-400"
              >
                Contact
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-5 text-4xl font-semibold leading-none tracking-tighter md:text-5xl"
              >
                Say hello.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-6 max-w-[44ch] leading-relaxed text-zinc-600">
                We love mail — especially the kind that starts a project, asks
                a question, or just says hi.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="flex flex-col items-start gap-5 lg:items-end">
              <MagneticLink
                href="mailto:freitagskindapps@gmail.com"
                className="inline-flex items-center gap-2.5 rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                <EnvelopeSimple size={16} />
                freitagskindapps@gmail.com
              </MagneticLink>
              <a
                href="/"
                className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Prefer to wander? Visit the 3D island
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-zinc-200/60">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs text-zinc-400">
            © 2026 freitagskind apps — made with care
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/imprint"
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-900"
            >
              Imprint
            </a>
            <a href="/" className="text-xs text-zinc-400 transition-colors hover:text-zinc-900">
              3D island
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
