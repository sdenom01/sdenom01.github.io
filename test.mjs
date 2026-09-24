/* Smoke test — `node test.mjs`. No deps.
   Catches the things that actually break this site: a renamed element id,
   an asset path that points at nothing, or malformed entries in the data
   arrays after a hand-edit. */

import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const js   = readFileSync("main.js",    "utf8");
const css  = readFileSync("styles.css", "utf8");

/* 1. every element main.js looks up by id exists in the HTML */
const ids = [...js.matchAll(/\$\("#([\w-]+)"/g)].map(m => m[1]);
assert.ok(ids.length >= 5, "expected main.js to query several ids");
for (const id of new Set(ids))
  assert.ok(html.includes(`id="${id}"`), `main.js queries #${id} but index.html has no such id`);

/* 2. every asset referenced anywhere is actually on disk */
const refs = [...(html + js + css).matchAll(/["'(](assets\/[^"')\s]+)/g)].map(m => m[1]);
assert.ok(refs.length >= 2, "expected asset references");
for (const f of new Set(refs))
  assert.ok(existsSync(f), `referenced but missing: ${f}`);

/* 3. data arrays parse and hold the shape the renderer assumes */
const grab = name => {
  const i = js.indexOf(`const ${name} = [`);
  assert.ok(i > -1, `${name} not found`);
  const start = js.indexOf("[", i);
  let depth = 0, end = start;
  for (; end < js.length; end++) {
    if (js[end] === "[") depth++;
    else if (js[end] === "]" && --depth === 0) break;
  }
  return eval(js.slice(start, end + 1)); // our own file, not user input
};

const featured = grab("FEATURED");
const jams     = grab("JAMS");

assert.ok(featured.length >= 1, "FEATURED is empty");
for (const g of featured) {
  assert.ok(g.title && g.meta && g.desc && g.tag, `FEATURED entry missing a field: ${g.title}`);
}
if (!featured.some(g => g.itch || g.itchEmbed)) {
  console.warn("  ! no FEATURED entry has an itch URL yet — every card reads \"Not yet public\"");
}

assert.ok(jams.length >= 25, `resume claims 25+ jams, ledger has ${jams.length}`);
for (const j of jams) {
  assert.ok(Number.isInteger(j.y) && j.y > 2000 && j.y <= new Date().getFullYear() + 1,
            `bad year on "${j.t}": ${j.y}`);
  assert.ok(j.t && j.j && j.e, `jam entry missing a field: ${JSON.stringify(j)}`);
}
const titles = jams.map(j => j.t);
assert.equal(new Set(titles).size, titles.length, "duplicate jam titles");

/* 4. the year chips the UI builds must all map to rows */
const chipYears = new Set(jams.map(j => j.y));
assert.ok(chipYears.size > 1, "filter needs more than one year to be useful");

/* 5. contact details the HTML promises are present */
for (const needle of ["assets/shane-denomme-resume-2026.pdf", "tel:+1", "github.com/sdenom01", "linkedin.com/in/"])
  assert.ok(html.includes(needle), `contact block is missing ${needle}`);

/* 6. both themes define every colour token (a token defined only in one
      theme renders as transparent/black in the other) */
const tokens = t => new Set([...t.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
const light = tokens(css.slice(css.indexOf(":root{"), css.indexOf('[data-theme="dark"]')));
const dark  = tokens(css.slice(css.indexOf('[data-theme="dark"]'), css.indexOf("*,*::before")));
for (const t of dark)
  assert.ok(light.has(t), `${t} is defined for dark but never for light`);

/* 7. project pages: shared shell intact, links resolve, no broken image paths */
const PAGES = ["robogrow/index.html", "terrain/index.html"];
for (const page of PAGES) {
  assert.ok(existsSync(page), `missing project page ${page}`);
  const p = readFileSync(page, "utf8");
  assert.ok(p.includes('href="../styles.css"'), `${page} does not load the shared stylesheet`);
  assert.ok(/<title>[^<]+<\/title>/.test(p), `${page} has no title`);
  assert.ok(p.includes('id="theme"'), `${page} is missing the theme toggle`);
  // every ../assets/... reference must exist on disk
  for (const f of new Set([...p.matchAll(/["'(]\.\.\/(assets\/[^"')\s]+)/g)].map(m => m[1])))
    assert.ok(existsSync(f), `${page} references missing asset ${f}`);
  // in-page anchors back to the index must be real section ids
  for (const id of new Set([...p.matchAll(/href="\.\.\/#([\w-]+)"/g)].map(m => m[1])))
    assert.ok(html.includes(`id="${id}"`), `${page} links to ../#${id} which the index lacks`);
}

/* 8. the index must actually link to each project page */
for (const page of PAGES) {
  const dir = page.replace(/\/index\.html$/, "/");
  assert.ok(html.includes(`href="${dir}"`), `index.html never links to ${dir}`);
}

const slots = PAGES.reduce((n, p) => n + (readFileSync(p, "utf8").match(/class="ph"/g) || []).length, 0);
if (slots) console.warn(`  ! ${slots} placeholder slot(s) still unfilled across project pages`);

console.log(`ok — ${featured.length} featured, ${jams.length} jam entries, ` +
            `${new Set(refs).size} assets, ${chipYears.size} filter years`);
