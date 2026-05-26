# 🎬 Reelationship — UI Design System

> *Designing for people who send 47 reels a day and call it "communicating".*

This document defines the visual language, component patterns, and UX rules for Reelationship. The vibe is: **chaotic fun, but make it pretty**. Like your friend who has impeccable taste in memes.

---

## Brand Personality

Reelationship is **not** a serious productivity tool. It is a place where your best friend sends you a cooking video at 2am with the note "we should make this" and you both know you never will. Design decisions should reflect this energy.

| Trait | What it means in UI |
|---|---|
| **Playful** | Rounded everything. Bouncy animations. Emoji that mean business. |
| **Warm** | It's about relationships. Colours feel human, not corporate. |
| **A little chaotic** | Slight imperfections are fine. We're not Linear. |
| **Brutally honest** | Empty states say exactly what they are, with a roast. |

---

## Colour Palette

### Primary — Reel Purple

The main brand colour. Used for CTAs, active states, and anything that says "yes this is the app."

| Token | Hex | Usage |
|---|---|---|
| `--purple-50` | `#EEEDFE` | Backgrounds, tag chips, subtle highlights |
| `--purple-200` | `#AFA9EC` | Borders, dividers |
| `--purple-500` | `#6B63D1` | Primary buttons, links, active nav |
| `--purple-700` | `#3C3489` | Hover states, pressed buttons |
| `--purple-900` | `#26215C` | Text on light purple backgrounds |

### Secondary — Coral Chaos

Used for reactions, notifications, "oh something happened" moments.

| Token | Hex | Usage |
|---|---|---|
| `--coral-50` | `#FAECE7` | Notification backgrounds |
| `--coral-400` | `#D85A30` | Reaction badges, unread dots |
| `--coral-700` | `#712B13` | Reaction text on light backgrounds |

### Accent — Teal Chill

Used for tags, "Watch Together" mode, and anything collaborative.

| Token | Hex | Usage |
|---|---|---|
| `--teal-50` | `#E1F5EE` | Tag chip backgrounds |
| `--teal-500` | `#1D9E75` | Tag chip borders, icons |
| `--teal-800` | `#085041` | Tag text |

### Neutrals

| Token | Hex | Usage |
|---|---|---|
| `--gray-50` | `#F1EFE8` | Page background |
| `--gray-100` | `#D3D1C7` | Card borders |
| `--gray-400` | `#888780` | Placeholder text, muted labels |
| `--gray-700` | `#444441` | Body text |
| `--gray-900` | `#2C2C2A` | Headings |

### Semantic

| Purpose | Colour |
|---|---|
| Success | `#1D9E75` (Teal 500) |
| Warning | `#BA7517` (Amber 600) |
| Error / Danger | `#E24B4A` (Red 400) |
| Info | `#378ADD` (Blue 400) |
| Sensitive content blur | `rgba(0, 0, 0, 0.65)` over `blur(14px)` |

---

## Typography

**Font:** System font stack — no custom fonts to load, keeps it snappy.

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Scale

| Name | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `display` | 28px | 600 | 1.2 | App name, big moments |
| `heading-1` | 22px | 600 | 1.3 | Page titles |
| `heading-2` | 18px | 500 | 1.4 | Section headers |
| `heading-3` | 15px | 500 | 1.4 | Card titles, room names |
| `body` | 14px | 400 | 1.6 | General content |
| `small` | 12px | 400 | 1.5 | Timestamps, labels, metadata |
| `micro` | 11px | 500 | 1.4 | Badges, tags, chips |

### Rules

- **Sentence case everywhere.** Title Case is for people who enjoyed meetings in 2019.
- No text below 11px. We respect eyeballs.
- Video titles truncate at 2 lines (`-webkit-line-clamp: 2`). No one needs to read a 40-word YouTube title in full.
- Timestamps are always relative ("2h ago", "just now"). Absolute timestamps only in tooltips on hover.

---

## Spacing

An 8px base grid. Everything snaps to multiples of 4 or 8.

| Token | Value | Typical usage |
|---|---|---|
| `--space-1` | 4px | Icon-to-label gap, tight inline spacing |
| `--space-2` | 8px | Between related elements |
| `--space-3` | 12px | Internal card padding (compact) |
| `--space-4` | 16px | Standard component padding |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Page section separation |
| `--space-12` | 48px | Large whitespace, empty states |

---

## Border Radius

We are a round app. We believe in curves. Squares are for spreadsheets.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Badges, chips, small elements |
| `--radius-md` | 10px | Buttons, inputs, small cards |
| `--radius-lg` | 16px | Video cards, room cards, panels |
| `--radius-xl` | 24px | Bottom sheets, modals |
| `--radius-full` | 9999px | Avatars, reaction pills, toggle tracks |

---

## Shadows

Flat by default. Shadows only when elevation is meaningful.

```css
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.08);   /* Cards at rest */
--shadow-md:  0 4px 12px rgba(0, 0, 0, 0.10);  /* Modals, popovers */
--shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.14);  /* Watch Together overlay */
```

No shadow on buttons. The colour change is enough. We're not building a bank.

---

## Components

### Video Card

The atomic unit of the entire app. Gets it right or nothing works.

```
┌─────────────────────────────────┐
│  [Thumbnail / Embedded Player]  │  ← 16:9 ratio, overflow hidden, radius-lg
│                                 │
│  Platform badge     ⏱ 0:32 note │  ← top-right overlay on thumbnail
├─────────────────────────────────┤
│  Video title (2 line clamp)     │  ← heading-3
│  @username · 2h ago             │  ← small, gray-400
│                                 │
│  [🏷 cooking] [🏷 funny]         │  ← teal chip tags
│                                 │
│  😂 12  💬 3  📌 note           │  ← reaction row
└─────────────────────────────────┘
```

- Thumbnail always 16:9. Use `object-fit: cover`. Never stretch a video, have some dignity.
- Platform badge: small pill bottom-left of thumbnail. YouTube = red, Instagram = gradient purple-orange, TikTok = black, X = black.
- Sensitive content: entire card blurs behind a `⚠ Sensitive` overlay with a "Tap to reveal" button. The overlay is slightly translucent so users can tell it's definitely a video and not a bomb.
- Hover state: subtle `scale(1.01)` transform + shadow-sm. 150ms ease. Do not `scale(1.08)`. We're not a 2015 Bootstrap site.

### Room Card

```
┌────────────────────────────────┐
│  🎬  Date Night Dumps          │  ← emoji + room name
│      5 members · 47 videos     │  ← small metadata
│                                │
│  👤👤👤 +2                     │  ← avatar stack, max 3 shown
│                            →   │  ← chevron
└────────────────────────────────┘
```

- Avatar stack: 28px circles, overlap by 8px, `border: 2px solid white`.
- Unread indicator: small coral dot (10px) top-right of room card. Disappears when room is opened.

### Reaction Bar

```
[😂 12]  [❤️ 8]  [💀 3]  [+]
```

- Reactions are pills: `--purple-50` background, `--purple-700` text when selected, gray when not.
- Selected reaction wiggles on tap: `@keyframes wiggle` (±5deg, 2 cycles, 200ms). Because why not.
- The `[+]` button opens an emoji picker. Keep it small. No one needs the full unicode emoji keyboard to react to a reel.

### Video Note

```
┌─ 📌 Note from @tuan ──────────────────┐
│  ⏱ 0:32 — "watch this part omg"       │
│                              [Private] │
└────────────────────────────────────────┘
```

- Timestamp badge is clickable — jumps player to that second.
- Private notes have a `🔒` lock icon and muted styling. Shared notes are full colour.
- @mentions are highlighted in `--purple-500` and are tappable.

### Permission Badge

Used on collections to show who can see them.

| Permission | Badge | Colour |
|---|---|---|
| Public | 🌍 Public | Teal |
| Members only | 👥 Members | Purple |
| Private | 🔒 Private | Gray |
| Sensitive | ⚠️ Sensitive | Coral |

### Taste Match Score

```
┌──────────────────────┐
│  You & @minh         │
│                      │
│      87%             │  ← large, purple, animated count-up on load
│  Taste Match 🎯      │
│                      │
│  Both love: cooking, │  ← shared tags
│  memes, chaos        │
└──────────────────────┘
```

- Score animates up from 0 on first view. Petty? Yes. Fun? Also yes.
- Below ~30%: "Y'all are in different universes 🪐"
- 30–60%: "Some overlap, mostly chaos 🎲"
- 60–85%: "You get each other 🤝"
- 85–100%: "Are you the same person? 👀"

---

## Sensitive Content System

When a video or collection is marked **Sensitive**:

1. Thumbnail is blurred with `filter: blur(14px)` and darkened with `rgba(0,0,0,0.65)` overlay
2. A warning card sits on top:
   ```
   ⚠️ Sensitive content
   [Reveal]
   ```
3. Tapping "Reveal" clears the blur for that card only, in that session. Refreshing re-blurs it. We're not letting anyone get caught off guard.
4. Room admins can toggle `maxPermission: "members"` to fully hide sensitive collections for the whole room — useful for family rooms or work rooms where colleagues still inexplicably share memes.

The blur reveals progressively on tap: `blur(14px) → blur(8px) → blur(0)` over 300ms. Dramatic. Intentional.

---

## Motion & Animation

**Philosophy:** Animations should feel like a response, not a performance. Short, purposeful, not the kind that makes users wonder if the app is broken.

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Page transition | Fade + 8px slide up | 180ms | `ease-out` |
| Card appear | Fade in + 4px slide up | 120ms | `ease-out` |
| Reaction tap | Wiggle (±5deg) | 200ms | `ease-in-out` |
| Sensitive reveal | Blur step-down | 300ms | `ease` |
| Taste score count-up | Number lerp from 0 | 800ms | `ease-out` |
| Watch Together join | Pulse ring on avatar | 600ms | `ease-in-out` |
| New video in feed | Slides in from top | 250ms | `ease-out` |
| Live reaction overlay | Float up + fade out | 1200ms | `ease-out` |

Always wrap animations in `@media (prefers-reduced-motion: no-preference)`. Some people don't want sparkles. Respect that.

---

## Empty States

Empty states should not be depressing. They should be honest and slightly teasing.

| Screen | Empty State Text | Icon |
|---|---|---|
| Room feed — no videos | "No reels yet. Someone has to go first. (It's you.)" | 🎬 |
| Room feed — first ever open | "Your room is a blank canvas. Or an empty void. Tomato, tomato." | 🫙 |
| Queue | "The queue is empty. Democracy has failed." | 🗳️ |
| Collections | "No collections yet. Your chaos is still unstructured." | 📁 |
| Search — no results | "Nothing found. Either the tag doesn't exist or you misspelled it. Probably both." | 🔍 |
| Notifications | "No new activity. Your friends have abandoned you. Or they're just busy." | 🔔 |
| Taste Match | "Share more videos to unlock your taste match. Go consume content." | 🎯 |
| Weekly Recap — no activity | "Nothing happened this week. You were either on a detox or a vacation. Either way, good for you." | 📅 |

Keep empty states under 2 sentences. This is a UI, not a therapy session.

---

## Navigation

### Mobile (bottom nav bar)

```
[🏠 Rooms]  [🔍 Search]  [➕]  [🔔 Notifs]  [👤 Profile]
```

- `[➕]` is the big purple centred button. It opens the "paste a video link" sheet. This is the most important button in the app.
- Active tab is purple. Everything else is gray.
- Notification dot on the bell when there's unseen activity.

### Desktop (left sidebar)

```
🎬 Reelationship
──────────────
🏠 Rooms
🔍 Search
🔔 Notifications
👤 Profile
──────────────
[ROOMS LIST]
  📺 Date Night Dumps
  💀 Cursed Content
  🍕 Food Gang
  + New Room
──────────────
⚙️ Settings
```

- Sidebar is 240px wide, fixed.
- Current room is highlighted with `--purple-50` background and left border `--purple-500`.
- Collapsed state on smaller screens: icon-only, 60px wide.

---

## Watch Together Mode

When a Watch Together session is active, the UI shifts:

- A persistent banner appears at the top of the room: `▶️ Watch Together — 3 watching`
- Clicking it opens a full-screen overlay with the video + floating reactions
- Floating reactions: emoji float up from the bottom in random horizontal positions, fade out over 1.2s
- A "Host" crown 👑 appears next to the host's avatar in the member list
- Non-hosts see a `"Following @username"` label under the player

If the connection drops: `"Lost sync. 😵 Reconnecting..."` — then re-syncs automatically on reconnect.

---

## Onboarding

Three screens. No more.

1. **"What is this thing?"** — One sentence: "Share reels, shorts, and videos with your people. All in one place."
2. **"Make your first room"** — Name it. Rooms can have an emoji prefix. Encourage chaos.
3. **"Invite someone"** — Copy invite link. If they don't join within 10 minutes, that's between them and their conscience.

No tutorial tooltips. No product tours. If the app needs a manual, the app has failed.

---

## Error States

Errors should be honest, short, and not make the user feel like they did something wrong (even when they did).

| Error | Message |
|---|---|
| Video URL not recognised | "We don't recognise that link. Try YouTube, Instagram, TikTok, or X." |
| Failed to load preview | "Couldn't load the preview. The link still works — we're just bad at thumbnails sometimes." |
| Room invite expired | "This invite link has expired. Poke whoever sent it to generate a new one." |
| Network error | "You appear to be offline. Classic." |
| Permissions error | "You don't have access to this. Nothing personal." |
| Generic error | "Something went wrong. This is our fault, not yours. Probably." |

---

## Accessibility

- All interactive elements are keyboard-navigable. Tab order is logical.
- Focus rings: `outline: 2px solid var(--purple-500); outline-offset: 2px`. Never `outline: none` without a replacement.
- Colour is never the only indicator of state. Icons, labels, and patterns back it up.
- All images have `alt` text. Video thumbnails use the video title as alt.
- Contrast ratios meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text).
- Sensitive blur overlays include `aria-label="Sensitive content, tap to reveal"` on the reveal button.

---

## Dark Mode

The app supports dark mode automatically via `prefers-color-scheme`.

- Backgrounds invert: `--gray-50` becomes `#1A1A18`, cards become `#242421`
- Purple stays purple — it looks great dark
- Coral and teal stay at their mid-range values (400–500), lightened slightly
- Never use `#000000` black — use `#1A1A18` for the deepest dark
- All shadows become lighter, not darker: `rgba(0,0,0,0.3)` → `rgba(255,255,255,0.05)`

Test every component in both modes before shipping. Dark mode bugs are the most embarrassing bugs.

---

## Tone of Voice (Microcopy)

The app has a personality. It's your group chat's funniest member — warm, a little chaotic, but never mean.

**Do:**
- Use casual language: "Share a reel", not "Upload media content"
- Be specific in errors: "Can't connect to YouTube" not "Error 403"
- Use second person: "Your rooms", "Your taste match"
- Occasionally roast the user (gently): "No videos yet. Someone has to go first."

**Don't:**
- Use corporate speak: "Leverage", "synergise", "streamline"
- Apologise excessively in errors: "We're so sorry for the inconvenience—"
- Be vague: "Something went wrong" should always have a follow-up
- Use exclamation marks excessively! Everything! Is! Not! Exciting!

**Button labels:**
- ✅ "Share to room" — not "Submit"
- ✅ "Start watching" — not "Initiate Watch Together Session"
- ✅ "Invite someone" — not "Add member"
- ✅ "Leave room" — not "Unsubscribe from group"

---

*Design system version 1.0 — May 2026*
*"Ship it. It'll be fine. Probably."*
