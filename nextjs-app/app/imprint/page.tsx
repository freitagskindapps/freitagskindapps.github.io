"use client";

import { motion } from "framer-motion";

export default function Imprint() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200/50">
        <a href="/" className="flex items-center gap-2 text-zinc-900 font-medium no-underline">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-1 bg-white rounded-full" />
          </div>
          <span className="text-lg">freitagskind</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors no-underline">
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-zinc-900">
            Imprint
          </h1>

          <div className="prose prose-zinc max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900">
                Responsible for this website
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                Maxi Gaesslein<br />
                Berlin, Germany
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900">
                Contact
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                Email:{" "}
                <a
                  href="mailto:contact@freitagskindapps.com"
                  className="text-amber-500 hover:underline no-underline"
                >
                  contact@freitagskindapps.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900">
                Legal Disclaimer
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                freitagskind apps are provided "as is" without warranty of any kind. We are not
                responsible for any damages arising from use of our apps.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-zinc-200 mt-auto">
        <div className="container">
          <p className="text-zinc-600">© 2026 freitagskind. Made with care.</p>
        </div>
      </footer>
    </div>
  );
}
