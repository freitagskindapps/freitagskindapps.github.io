/**
 * Site i18n: English and German. Preference stored in localStorage (fk-site-lang).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'fk-site-lang';

  var STRINGS = {
    en: {
      'meta.title': 'freitagskind apps — Thoughtful Apps for Everyday Life',
      'meta.description':
        'freitagskind apps creates thoughtful mobile tools that make everyday life simpler, calmer, and more fun.',
      'skip.main': 'Skip to main content',
      'nav.apps': 'Apps',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.explore': 'Explore Apps',
      'nav.lang': 'Language',
      'tag.studio': 'Independent App Studio',
      'hero.line1': 'Build better days,',
      'hero.line2': 'one app at a time.',
      'hero.sub':
        'Thoughtful mobile tools that make everyday life simpler, calmer, and more fun.',
      'hero.cta1': 'Explore Our Apps',
      'hero.cta2': 'Get in Touch',
      'what.tag': 'What We Do',
      'what.h2': 'Small apps. Real impact.',
      'what.p':
        "We focus on utility-first apps that solve clear problems quickly. No bloated features, no complexity for complexity's sake — just clean, practical experiences people actually use.",
      'what.c1t': 'Focused utility',
      'what.c1p':
        'Apps that do one thing exceptionally well. No feature creep, no subscription traps.',
      'what.c2t': 'Premium craft',
      'what.c2p':
        'Thoughtful UI details and delightful interactions. Every pixel earns its place.',
      'what.c3t': 'Built for humans',
      'what.c3p':
        'Real problems, real people. Every app starts with a daily frustration worth solving.',
      'feat.tag': 'Featured App',
      'feat.badge': 'Android',
      'feat.formerly': 'formerly Daymark',
      'feat.desc':
        'A countdown widget app designed to keep your important moments visible and motivating. From birthdays and trips to personal goals, Pendula helps you stay connected to what matters.',
      'feat.li1': 'Beautiful widgets with circular progress rings',
      'feat.li2': 'Category color-coding for instant visual hierarchy',
      'feat.li3': 'Premium dark aesthetic with gradient accents',
      'feat.li4': 'Free to download on Android',
      'feat.cta': 'Learn More About Pendula',
      'phone.days': 'days',
      'phone.ev1': 'Summer Holiday',
      'phone.d1': 'July 14, 2026',
      'phone.lb1': "Mom's B-Day",
      'phone.lb2': 'Team Trip',
      'approach.tag': 'Our Approach',
      'approach.h2': 'How we build',
      'ap1.t': 'Problem First',
      'ap1.p':
        'We start with real daily frustrations, not trends. Every app we build exists because someone needed it.',
      'ap2.t': 'Simple by Design',
      'ap2.p':
        "We remove friction until the app feels obvious. The best UX is the one you don't notice.",
      'ap3.t': 'Built to Last',
      'ap3.p':
        "Reliable architecture, clean UX, and continuous improvement. We ship things we're proud of.",
      'about.tag': 'About',
      'about.h2a': 'Independent. Practical.',
      'about.h2b': 'Human-centered.',
      'about.p':
        'freitagskind apps is an independent app studio focused on meaningful digital products. Our goal is to create tools people open every day because they are genuinely useful — not because dark patterns force them to.',
      'contact.h2a': "Let's build something",
      'contact.h2b': 'people love.',
      'contact.p': 'Have an app idea, a collaboration in mind, or just want to say hi?',
      'contact.btn': 'Contact freitagskind apps',
      'footer.line': 'Thoughtful apps for everyday life.',
      'footer.copy': '© 2026 freitagskind apps.',
      'footer.approach': 'Approach',
      'footer.imprint': 'Imprint',
      'imprint.meta.title': 'Imprint — freitagskind apps',
      'imprint.meta.desc': 'Legal notice and imprint for freitagskind apps.',
      'imprint.kicker': 'Legal',
      'imprint.h1': 'Imprint',
      'imprint.tmg': 'Information according to § 5 TMG',
      'imprint.rstv': 'Responsible for content (§ 55 Abs. 2 RStV)',
      'imprint.rstv.p': 'Maximilian Freitag',
      'imprint.disclaimer.h': 'Disclaimer',
      'imprint.disclaimer.p':
        'Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.',
    },
    de: {
      'meta.title': 'freitagskind apps — Durchdachte Apps für den Alltag',
      'meta.description':
        'freitagskind apps entwickelt durchdachte mobile Hilfen, die den Alltag einfacher, ruhiger und angenehmer machen.',
      'skip.main': 'Zum Hauptinhalt springen',
      'nav.apps': 'Apps',
      'nav.about': 'Über uns',
      'nav.contact': 'Kontakt',
      'nav.explore': 'Apps entdecken',
      'nav.lang': 'Sprache',
      'tag.studio': 'Unabhängiges App-Studio',
      'hero.line1': 'Mach dir bessere Tage,',
      'hero.line2': 'eine App nach der anderen.',
      'hero.sub':
        'Durchdachte mobile Hilfen, die den Alltag einfacher, ruhiger und angenehmer machen.',
      'hero.cta1': 'Unsere Apps entdecken',
      'hero.cta2': 'Kontakt aufnehmen',
      'what.tag': 'Was wir tun',
      'what.h2': 'Kleine Apps. Echte Wirkung.',
      'what.p':
        'Wir konzentrieren uns auf nützliche Apps, die klare Probleme schnell lösen. Keine aufgeblähten Funktionen, keine Komplexität um der Komplexität willen — sondern klare, praktische Erlebnisse, die Menschen wirklich nutzen.',
      'what.c1t': 'Klarer Nutzen',
      'what.c1p':
        'Apps, die eine Sache besonders gut machen. Kein Feature-Creep, keine Abo-Fallen.',
      'what.c2t': 'Liebe zum Detail',
      'what.c2p':
        'Durchdachte UI-Details und kleine Freuden beim Nutzen. Jedes Pixel hat seinen Platz.',
      'what.c3t': 'Für Menschen gebaut',
      'what.c3p':
        'Echte Probleme, echte Menschen. Jede App entsteht aus einem Alltagsärgernis, das es wert ist, gelöst zu werden.',
      'feat.tag': 'App im Fokus',
      'feat.badge': 'Android',
      'feat.formerly': 'ehemals Daymark',
      'feat.desc':
        'Eine Countdown-Widget-App, die deine wichtigsten Momente sichtbar und motivierend vor Augen hält. Von Geburtstagen und Reisen bis zu persönlichen Zielen — Pendula hilft dir dabei, mit dem, was zählt, verbunden zu bleiben.',
      'feat.li1': 'Schöne Widgets mit kreisförmigen Fortschrittsringen',
      'feat.li2': 'Farbige Kategorien für sofortige visuelle Orientierung',
      'feat.li3': 'Premium-Dark-Look mit Farbverläufen',
      'feat.li4': 'Kostenlos im Play Store',
      'feat.cta': 'Mehr über Pendula erfahren',
      'phone.days': 'Tage',
      'phone.ev1': 'Sommerferien',
      'phone.d1': '14. Juli 2026',
      'phone.lb1': 'Mamas Geburtstag',
      'phone.lb2': 'Team-Ausflug',
      'approach.tag': 'Unser Ansatz',
      'approach.h2': 'So entwickeln wir',
      'ap1.t': 'Problem zuerst',
      'ap1.p':
        'Wir starten mit echtem Alltagsfrust, nicht mit Trends. Jede App gibt es, weil sie jemand gebraucht hat.',
      'ap2.t': 'Einfachheit als Prinzip',
      'ap2.p':
        'Wir nehmen Reibung weg, bis sich die App selbstverständlich anfühlt. Die beste UX ist die, die man nicht merkt.',
      'ap3.t': 'Gebaut, um zu bleiben',
      'ap3.p':
        'Solide Architektur, klare UX und kontinuierliche Verbesserung. Wir liefern Dinge, auf die wir stolz sind.',
      'about.tag': 'Über uns',
      'about.h2a': 'Unabhängig. Praktisch.',
      'about.h2b': 'Menschenzentriert.',
      'about.p':
        'freitagskind apps ist ein unabhängiges App-Studio mit Fokus auf sinnvolle digitale Produkte. Unser Ziel: Werkzeuge, die Menschen jeden Tag öffnen, weil sie wirklich helfen — nicht weil Dark Patterns sie dazu zwingen.',
      'contact.h2a': 'Lass uns etwas bauen,',
      'contact.h2b': 'das Menschen lieben.',
      'contact.p':
        'Du hast eine App-Idee, eine Kooperation im Kopf oder möchtest einfach Hallo sagen?',
      'contact.btn': 'freitagskind apps kontaktieren',
      'footer.line': 'Durchdachte Apps für den Alltag.',
      'footer.copy': '© 2026 freitagskind apps.',
      'footer.approach': 'Ansatz',
      'footer.imprint': 'Impressum',
      'imprint.meta.title': 'Impressum — freitagskind apps',
      'imprint.meta.desc': 'Impressum und rechtliche Hinweise für freitagskind apps.',
      'imprint.kicker': 'Rechtliches',
      'imprint.h1': 'Impressum',
      'imprint.tmg': 'Angaben gemäß § 5 TMG',
      'imprint.rstv': 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
      'imprint.rstv.p': 'Maximilian Freitag',
      'imprint.disclaimer.h': 'Haftungsausschluss',
      'imprint.disclaimer.p':
        'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.',
    },
  };

  function getStoredLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s === 'en' || s === 'de') return s;
    } catch (e) {}
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('de') === 0 ? 'de' : 'en';
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function setMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setOg(property, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setTwitter(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', content);
  }

  function applyLang(lang) {
    var dict = STRINGS[lang];
    if (!dict) return;

    document.documentElement.lang = lang === 'de' ? 'de' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key || dict[key] === undefined) return;
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    });

    var isImprint = /imprint\.html$/i.test(window.location.pathname || '');
    var titleKey = isImprint ? 'imprint.meta.title' : 'meta.title';
    var descKey = isImprint ? 'imprint.meta.desc' : 'meta.description';
    if (dict[titleKey]) document.title = dict[titleKey];
    setMeta('description', dict[descKey]);
    setOg('og:locale', lang === 'de' ? 'de_DE' : 'en_US');
    setOg('og:title', dict[titleKey] || dict['meta.title']);
    setOg('og:description', dict[descKey] || dict['meta.description']);
    setTwitter('twitter:title', dict[titleKey] || dict['meta.title']);
    setTwitter('twitter:description', dict[descKey] || dict['meta.description']);

    var langSwitch = document.querySelector('.lang-switch');
    if (langSwitch && dict['nav.lang']) {
      langSwitch.setAttribute('aria-label', dict['nav.lang']);
    }

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      var l = btn.getAttribute('data-lang-set');
      var active = l === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('lang-switch__btn--active', active);
    });

    updateJsonLdLanguage(lang);
  }

  function updateJsonLdLanguage(lang) {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(function (script) {
      try {
        var data = JSON.parse(script.textContent);
        if (data && data['@graph'] && Array.isArray(data['@graph'])) {
          data['@graph'].forEach(function (node) {
            if (node['@type'] === 'WebSite') {
              node.inLanguage = lang === 'de' ? 'de' : 'en';
            }
            if (node['@type'] === 'Organization' && dictOrgDesc(lang)) {
              node.description = dictOrgDesc(lang);
            }
          });
          script.textContent = JSON.stringify(data);
        }
      } catch (e) {}
    });
  }

  function dictOrgDesc(lang) {
    if (!STRINGS[lang]) return '';
    return lang === 'de'
      ? 'Unabhängiges App-Studio mit durchdachten Apps für den Alltag.'
      : 'Independent app studio building thoughtful mobile tools for everyday life.';
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'de') return;
    setStoredLang(lang);
    applyLang(lang);
    window.dispatchEvent(new CustomEvent('fk-lang-change', { detail: { lang: lang } }));
  }

  function bindControls() {
    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-lang-set');
        if (l === 'en' || l === 'de') setLang(l);
      });
    });
  }

  function init() {
    applyLang(getStoredLang());
    bindControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.fkI18n = {
    getLang: getStoredLang,
    setLang: setLang,
    STRINGS: STRINGS,
  };
})();
