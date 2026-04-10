"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Smartphone, Heart, Clock, ArrowRight } from "lucide-react";

// Design Configuration (taste-skill)
const DESIGN_VARIANCE = 8; // Asymmetric, modern layouts
const MOTION_INTENSITY = 6; // Smooth, fluid animations
const VISUAL_DENSITY = 4; // Spacious, premium feel

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-zinc-50 text-zinc-900 selection:bg-amber-100 selection-text-amber-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200/50"
      >
        <a href="#top" className="flex items-center gap-2 text-zinc-900 font-medium no-underline">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-1 bg-white rounded-full" />
          </div>
          <span className="text-lg">freitagskind</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="#apps" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors no-underline">
            Apps
          </a>
          <a href="#about" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors no-underline">
            About
          </a>
        </div>
      </motion.nav>

      {/* Hero Section - Asymmetric layout */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background decorative elements */}
        <motion.div
          style={{ y: y1, background: 'linear-gradient(to bottom right, rgba(253, 230, 138, 0.3), transparent)', borderRadius: '9999px', filter: 'blur(48px)' }}
          className="absolute top-20 right-20 w-96 h-96"
        />
        <motion.div
          style={{ y: y2, opacity, background: 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.4), transparent)', borderRadius: '9999px', filter: 'blur(24px)' }}
          className="absolute bottom-20 left-20 w-64 h-64"
        />

        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-full"
              >
                <Sparkles className="w-4 h-4" />
                Thoughtful software
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-7xl font-bold tracking-tighter leading-none text-zinc-900"
              >
                Apps that get
                <br />
                <span className="text-amber-500">out of the way.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-zinc-600 leading-relaxed max-w-lg"
              >
                We build small, focused apps for people who want tools
                that work quietly and well.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 pt-4"
              >
                <motion.a
                  href="#apps"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors cursor-pointer no-underline"
                >
                  Explore Apps
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right: Visual element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Floating cards */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-6 border border-zinc-100"
                >
                  <Smartphone className="w-8 h-8 text-amber-500" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-6 border border-zinc-100"
                >
                  <Heart className="w-8 h-8 text-amber-500" />
                </motion.div>

                {/* Main card */}
                <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-8 shadow-2xl border border-zinc-100/50">
                  <div className="flex items-center justify-center h-64">
                    <Clock className="w-24 h-24 text-amber-500/80" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Our apps</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tab App Card */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-amber-500 rounded" />
                </div>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full">
                  iOS
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-zinc-900">Tab</h3>
              <p className="text-zinc-600 leading-relaxed">
                A calm way to keep track of what matters. Simple, fast, and quiet by design.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="flex items-center gap-2 text-amber-500 font-medium text-sm mt-4"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.article>

            {/* Coming Soon Card */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-sm border border-amber-100/50 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Coming soon
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-zinc-900">More coming</h3>
              <p className="text-zinc-600 leading-relaxed">
                We're working on something new. Slowly and carefully.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* About/Principles Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">How we work</span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Calm over clever",
                description: "The best interface is one you stop noticing. We build tools that serve their purpose and step aside.",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "No tricks",
                description: "No dark patterns. No false urgency. No confusing defaults. Just honest software that does what it says.",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Made with care",
                description: "Small team. Slow and deliberate. We ship when something is ready — not when a roadmap says so.",
              },
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4 p-6 rounded-2xl hover:bg-zinc-50 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900">{principle.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 border-t border-zinc-200 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600">© 2026 freitagskind. Made with care.</p>
            <div className="flex items-center gap-6">
              <a href="/imprint" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors no-underline">
                Imprint
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
