"use client";

import { motion } from "framer-motion";

export default function Imprint() {
  return (
    <div style={{ fontFamily: 'var(--font-geist-sans)', backgroundColor: 'var(--color-zinc-50)', color: '#18181B', minHeight: '100dvh' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border" style={{ backgroundColor: 'rgba(250, 250, 248, 0.8)', backdropFilter: 'blur(24px)', borderColor: 'rgba(228, 228, 230, 0.5)' }}>
        <a href="/" className="flex items-center gap-2 text-zinc-900 font-medium" style={{ textDecoration: 'none' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-amber-500)' }}>
            <div className="w-4 h-1 bg-white rounded-full" />
          </div>
          <span className="text-lg">freitagskind</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-zinc-600" style={{ color: 'var(--color-zinc-600)', textDecoration: 'none', transition: 'color 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="container px-6 lg:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-zinc-900" style={{ color: 'var(--color-zinc-900)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: '1.2' }}>
            Imprint
          </h1>

          <div className="prose prose-zinc max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900" style={{ color: 'var(--color-zinc-900)', fontWeight: 600, lineHeight: '1.3' }}>
                Responsible for this website
              </h2>
              <p className="text-zinc-600 leading-relaxed" style={{ color: 'var(--color-zinc-600)', lineHeight: 1.6 }}>
                Maxi Gaesslein<br />
                Berlin, Germany
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900" style={{ color: 'var(--color-zinc-900)', fontWeight: 600, lineHeight: '1.3' }}>
                Contact
              </h2>
              <p className="text-zinc-600 leading-relaxed" style={{ color: 'var(--color-zinc-600)', lineHeight: 1.6 }}>
                Email:{" "}
                <a
                  href="mailto:contact@freitagskindapps.com"
                  className="text-amber-700"
                  style={{ color: 'var(--color-amber-700)', textDecoration: 'none', transition: 'color 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  contact@freitagskindapps.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900" style={{ color: 'var(--color-zinc-900)', fontWeight: 600, lineHeight: '1.3' }}>
                Legal Disclaimer
              </h2>
              <p className="text-zinc-600 leading-relaxed" style={{ color: 'var(--color-zinc-600)', lineHeight: 1.6 }}>
                freitagskind apps are provided "as is" without warranty of any kind. We are not
                responsible for any damages arising from the use of our apps.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto" style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--color-zinc-200)' }}>
        <div className="container">
          <p className="text-zinc-600" style={{ color: 'var(--color-zinc-600)' }}>© 2026 freitagskind. Made with care.</p>
        </div>
      </footer>
    </div>
  );
}
