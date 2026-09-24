# shandenom.me

Static portfolio. Three files, no build step, no dependencies.

    index.html    structure and copy
    styles.css    all styling, both themes
    main.js       game data (top of file) + behaviour
    assets/       resume PDF, cover art
    CNAME         the custom domain
    test.mjs      smoke test — `node test.mjs`

## Editing

Almost everything you'll want to change lives in the **two arrays at the top of
`main.js`**:

- `FEATURED` — the three big cards in the Games section.
- `JAMS` — the ledger table. Year, title, jam name, engine.

Prose lives directly in `index.html`. Colours and fonts are CSS variables at the
top of `styles.css` (`:root` for light, `[data-theme="dark"]` for dark).

Run `node test.mjs` after editing. It catches missing assets, broken element
ids, and malformed data entries.

## Adding your itch.io games

Two ways, and you can mix them:

**Link out** — set `itch` on an entry to the project URL
(`https://zoped.itch.io/slime-ball`). The card becomes a link and the badge flips to
"Playable" on its own.

**Embed, so it plays on this page** — set `itchEmbed` to the embed URL. Get it
from itch: open the project → *Edit game* → scroll to the uploaded HTML build →
the embed/share option gives you a
`https://itch.io/embed-upload/1234567?color=000000` URL. Paste that.

Don't host the WebGL builds here. A Unity build is 20–100 MB; itch serves them
free with a proper player shell, fullscreen, and play counts, and GitHub Pages
has a 1 GB repo limit and a 100 MB per-file hard cap.

## Deploying

The site is served from the `sdenom01/sdenom01.github.io` repo (GitHub Pages,
`master` branch, root). Push to that repo and Pages rebuilds automatically.

    git push origin master

### Pointing shandenom.me at it

The domain is registered with Squarespace, so its DNS lives in the Squarespace
panel, not at GitHub. Delete the default Squarespace parking records for `@`
first, then add:

| Type  | Host | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | sdenom01.github.io   |

Once `dig shandenom.me` returns those four addresses, add the `CNAME` file back
to the repo (it should contain exactly `shandenom.me`) and set the same value
under **Settings → Pages → Custom domain**. Then tick **Enforce HTTPS** once the
certificate is issued.

The `CNAME` file is deliberately absent until DNS resolves — with it present,
Pages redirects every visitor to a domain that is not yet pointed here, which
makes the site unreachable.

## Local preview

    python3 -m http.server 8000     # then open http://localhost:8000
