/* ============================================================
   shanedenom.me

   >>> EDIT THE TWO ARRAYS BELOW. That's the whole content model. <<<

   FEATURED — big cards at the top of the Games section.
     itchEmbed : itch.io embed URL -> the game plays INLINE on this page.
                 Get it from your itch project page:
                 Edit game -> "Embed" / share -> copy the
                 https://itch.io/embed-upload/XXXXXXX?color=... URL.
     itch      : plain project URL. Used when there's no embed.
     img       : file in assets/. Omit and it falls back to a letter glyph.

   JAMS — the ledger table. Add { itch: "..." } to any row and the
          title becomes a link. Rows without one stay plain text.
   ============================================================ */

const FEATURED = [
  {
    title: "Kanoa",
    meta: "2024 — present · Unity 6.3 · C#",
    desc: "A roguelite tactical battle game. Squad-scale combat on a grid, with " +
          "progression that carries between runs. My long-form project — two years " +
          "in and still the thing I open first on a Saturday.",
    tag: "In development",
    itch: null,       // the itch "ability test" is an old build — not this game
    img: "assets/kanoa-a.jpg"
  },
  {
    title: "Fathom",
    meta: "2026 — present · Unity 6 · Netcode for GameObjects",
    desc: "Co-op survival on the water. Seasons, weather, tides, and a lighthouse " +
          "two people have to keep running between them. Networked from the first " +
          "commit rather than bolted on after.",
    tag: "In development",
    itch: null,
    img: "assets/fathom.jpg"
  },
  {
    title: "Hard Boiled",
    meta: "Dungeon Crawler Jam 2025 · Unity · Plays in your browser",
    desc: "A noir dungeon crawler where you are Coop, a hard-boiled chicken " +
          "detective. Time Crisis-style shooting through enemy-filled mazes to " +
          "recover twelve eggs — one of them a Fabergé. Right-click to aim, R to " +
          "reload, and use the cover.",
    tag: "Jam build",
    itch: "https://zoped.itch.io/cluck-detective",
    itchEmbed: "https://itch.io/embed-upload/13437361?color=1b1a16"
  }
];

/* Linked entries are live on itch.io. The rest survive only as repositories. */
const JAMS = [
  { y:2025, t:"Hard Boiled",              j:"Dungeon Crawler Jam 2025",  e:"Unity", itch:"https://zoped.itch.io/cluck-detective" },
  { y:2025, t:"Car Bowling",              j:"Brackeys Game Jam 14",      e:"Unity", itch:"https://zoped.itch.io/carwling" },
  { y:2025, t:"RC Bowling",               j:"Weekend build",             e:"Unity", itch:"https://zoped.itch.io/rc-bowling-test" },
  { y:2025, t:"Connections Jam",          j:"Connections Jam",           e:"Unity" },
  { y:2025, t:"3D Grid Tile World Editor",j:"Tooling spun out of the jams", e:"Unity" },
  { y:2024, t:"DUDE! WHERE'S MY KEYS!?",  j:"So Bad It's Good Jam 2024", e:"Unity", itch:"https://zoped.itch.io/dude-wheres-my-keys" },
  { y:2023, t:"Fighter's Quest",          j:"GBJam 11 — Game Boy limits",e:"Unity", itch:"https://zoped.itch.io/fighters-quest" },
  { y:2023, t:"Slime Ball",               j:"Juice Jam II",              e:"Unity", itch:"https://zoped.itch.io/slime-ball" },
  { y:2023, t:"Tribes",                   j:"Long-running side project", e:"Unity / Godot" },
  { y:2023, t:"Bullet Hell",              j:"—",                         e:"Unity" },
  { y:2023, t:"Crash Team Crasher",       j:"—",                         e:"Unity" },
  { y:2022, t:"Kenneymari",               j:"Kenney Jam 2022",           e:"Unity", itch:"https://zoped.itch.io/kenneymari" },
  { y:2022, t:"Layover",                  j:"Lost Relic Games Jam · team of five", e:"Unity", itch:"https://zoped.itch.io/layover" },
  { y:2022, t:"Hansel",                   j:"Virtual Pet Jam",           e:"Unity", itch:"https://zoped.itch.io/hansel" },
  { y:2022, t:"STALKER",                  j:"Remake of an older game of mine", e:"Unity", itch:"https://zoped.itch.io/stalker" },
  { y:2022, t:"DK30 Horror Platformer",   j:"DK30 challenge",            e:"Unity" },
  { y:2022, t:"Streets",                  j:"—",                         e:"Unity" },
  { y:2022, t:"Hoppy the Rabbit",         j:"—",                         e:"Unity" },
  { y:2021, t:"Cut The Cheese SIMULATOR", j:"Jamulator 2021",            e:"Unity", itch:"https://zoped.itch.io/who-cut-the-cheese" },
  { y:2021, t:"Forgemaster",              j:"Secret Santa Jam 2021 · team of six", e:"Unity", itch:"https://zoped.itch.io/forgemaster" },
  { y:2021, t:"Janitor Jubilee",          j:"Bored Pixels Jam 8",        e:"Unity" },
  { y:2021, t:"Evil Stardew",             j:"—",                         e:"Unity" },
  { y:2021, t:"JamSkeletal",              j:"—",                         e:"Unity" },
  { y:2021, t:"Space Joint",              j:"—",                         e:"Unity" },
  { y:2021, t:"Pikmin (study)",           j:"Mechanic study",            e:"Unity" },
  { y:2021, t:"Smash",                    j:"—",                         e:"Unity" },
  { y:2020, t:"Limited Space",            j:"—",                         e:"Unity" },
  { y:2020, t:"Bootleggers' Bacon",       j:"—",                         e:"Unity" },
  { y:2020, t:"Hordes",                   j:"—",                         e:"Unity" },
  { y:2020, t:"Coop Shooter",             j:"—",                         e:"Unreal" },
  { y:2019, t:"Blended Survival",         j:"—",                         e:"Unity" }
];

/* ── helpers ───────────────────────────────────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* ── featured cards ────────────────────────────────────── */
function media(g) {
  if (g.itchEmbed)
    return `<iframe src="${esc(g.itchEmbed)}" title="Play ${esc(g.title)}"
              allowfullscreen loading="lazy"></iframe>`;
  if (g.img)
    return `<img src="${esc(g.img)}" alt="${esc(g.title)} artwork" loading="lazy" decoding="async">`;
  return `<span class="gcard-glyph" aria-hidden="true">${esc(g.title[0])}</span>`;
}

$("#featured").innerHTML = FEATURED.map((g, i) => {
  const playable = !!(g.itchEmbed || g.itch);
  const playBadge = playable && g.tag !== "In development";
  const badge = playBadge ? "Playable" : g.tag;  // never claims playable without a link
  const inner = `
    <div class="gcard-media">
      <span class="gcard-stat${playBadge ? " play" : ""}">${esc(badge)}</span>
      ${media(g)}
    </div>
    <div class="gcard-body">
      <h4>${esc(g.title)}</h4>
      <p class="gcard-meta">${esc(g.meta)}</p>
      <p class="gcard-desc">${esc(g.desc)}</p>
      ${g.itchEmbed
        ? `<a class="gcard-go" href="${esc(g.itch)}" target="_blank" rel="noopener">Open on itch.io</a>`
        : `<span class="gcard-go${playable ? "" : " muted"}">${
            playable ? (playBadge ? "Play on itch.io" : "Try the prototype") : "Not yet public"
          }</span>`}
    </div>`;

  const cls = `gcard reveal${g.itchEmbed ? " is-embed" : ""}`;
  const d = ` style="--d:${i * 90}ms"`;

  return g.itch && !g.itchEmbed
    ? `<a class="${cls}"${d} href="${esc(g.itch)}" target="_blank" rel="noopener">${inner}</a>`
    : `<article class="${cls}"${d}>${inner}</article>`;
}).join("");

/* ── jam ledger + year filter ──────────────────────────── */
const body = $("#ledger-body");
body.innerHTML = JAMS.map(g => `
  <tr data-y="${g.y}">
    <td class="c-yr">${g.y}</td>
    <td class="c-name">${g.itch ? `<a href="${esc(g.itch)}" target="_blank" rel="noopener">${esc(g.t)}</a>` : esc(g.t)}</td>
    <td class="c-jam">${esc(g.j)}</td>
    <td class="c-eng">${esc(g.e)}</td>
  </tr>`).join("");

const years = ["All", ...new Set(JAMS.map(g => g.y))];
$("#filters").innerHTML = years.map(y =>
  `<button class="chip" type="button" data-y="${y}" aria-pressed="${y === "All"}">${y}</button>`
).join("");

$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  $$(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
  const y = b.dataset.y;
  $$("#ledger-body tr").forEach(r => r.classList.toggle("hide", y !== "All" && r.dataset.y !== y));
});

/* ── scroll reveal ─────────────────────────────────────── */
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    obs.unobserve(en.target);
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

$$(".reveal").forEach((el, i) => {
  // stagger siblings that don't already carry a delay
  if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${(i % 6) * 70}ms`);
  io.observe(el);
});

/* ── nav scrollspy ─────────────────────────────────────── */
const links = $$(".topbar nav a");
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.classList.toggle("on", a.hash === `#${en.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["work", "games", "workshop", "method", "contact"].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

/* ── theme ─────────────────────────────────────────────── */
const btn = $("#theme");
const setTheme = t => {
  document.documentElement.dataset.theme = t;
  const dark = t === "dark";
  btn.setAttribute("aria-pressed", dark);
  btn.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  $(".theme-txt", btn).textContent = dark ? "Light" : "Dark";
};
setTheme(document.documentElement.dataset.theme || "light"); // already set in <head>
btn.addEventListener("click", () => {
  const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", t);
  setTheme(t);
});

/* ── email: plain text in HTML, upgraded to a mailto here ─ */
const mail = $("#mail");
const addr = `${mail.dataset.u}@${mail.dataset.d}`;
mail.href = `mailto:${addr}`;
mail.textContent = addr;

$("#year").textContent = new Date().getFullYear();
