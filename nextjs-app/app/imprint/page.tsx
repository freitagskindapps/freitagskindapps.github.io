import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — freitagskind apps",
  description: "Impressum und Anbieterkennzeichnung von freitagskind apps.",
  robots: { index: false },
};

const sections = [
  {
    title: "Angaben gemäß § 5 DDG",
    body: (
      <p>
        Maximilian Freitag
        <br />
        Rudolf-Zenker-Str. 5
        <br />
        81377 München
        <br />
        Deutschland
      </p>
    ),
  },
  {
    title: "Kontakt",
    body: (
      <p>
        E-Mail:{" "}
        <a
          href="mailto:freitagskindapps@gmail.com"
          className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:decoration-amber-500"
        >
          freitagskindapps@gmail.com
        </a>
      </p>
    ),
  },
  {
    title: "Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV",
    body: (
      <p>
        Maximilian Freitag
        <br />
        Rudolf-Zenker-Str. 5
        <br />
        81377 München
      </p>
    ),
  },
  {
    title: "Verbraucherstreitbeilegung / Universalschlichtungsstelle",
    body: (
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
        vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    ),
  },
  {
    title: "Haftung für Inhalte",
    body: (
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
        auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
        §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
        überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
        Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
        Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
        hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
        Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
        Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
        Inhalte umgehend entfernen.
      </p>
    ),
  },
  {
    title: "Haftung für Links",
    body: (
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
        fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
        verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
        Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
        Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Bei
        Bekanntwerden von Rechtsverletzungen werden wir derartige Links
        umgehend entfernen.
      </p>
    ),
  },
  {
    title: "Urheberrecht",
    body: (
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
        sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
    ),
  },
];

export default function Imprint() {
  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8] text-zinc-900 [font-family:var(--font-geist-sans),system-ui,sans-serif]">
      {/* ---------- nav ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/60 bg-[#FAFAF8]/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
              <span className="h-1 w-3 rounded-full bg-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              freitagskind <span className="font-normal text-zinc-500">apps</span>
            </span>
          </a>
          <div className="flex items-center gap-7">
            <a
              href="/classic"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Zur Website
            </a>
          </div>
        </nav>
      </header>

      {/* ---------- content ---------- */}
      <main className="mx-auto max-w-[1200px] px-6 pb-28 pt-36 lg:px-10">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.2em] text-zinc-400">
          Rechtliches
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tighter md:text-5xl">
          Impressum
        </h1>

        <div className="mt-14 max-w-[820px] divide-y divide-zinc-200/70 border-t border-zinc-200/70">
          {sections.map((s) => (
            <section key={s.title} className="grid gap-3 py-9 lg:grid-cols-[260px_1fr] lg:gap-10">
              <h2 className="text-[15px] font-medium leading-snug text-zinc-900">
                {s.title}
              </h2>
              <div className="text-[15px] leading-relaxed text-zinc-600">{s.body}</div>
            </section>
          ))}
        </div>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-zinc-200/60">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs text-zinc-400">
            © 2026 freitagskind apps — made with care
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/classic"
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-900"
            >
              Website
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
