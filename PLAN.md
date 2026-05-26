# 🎬 Reelationship — Development Plan

> *"It's not a situationship, it's a reelationship."*

A shared short-form video platform where friends, couples, and chaotic group chats can dump reels at each other in an organised (ish) way.

---

## Tech Stack

| Layer | Tool | Plan |
|---|---|---|
| UI | React + Vite | SPA, component-based |
| Database | Firebase Firestore | Primary data store |
| Real-time | Firebase Realtime DB | Watch Together sync |
| Auth | Firebase Auth | Google + Apple login |
| Storage | Firebase Storage | Avatars only |
| Hosting | Cloudflare Pages | Auto-deploy from GitHub |
| Video previews | YouTube oEmbed + noembed.com | Client-side, free, no API key |

All services run on **free tiers only**. No credit card. No surprises.

---

## Feature List

| # | Feature | Phase |
|---|---|---|
| 1 | Universal Video Inbox (Reels, Shorts, TikTok) | 2 |
| 2 | Rooms / Shared Spaces | 2 |
| 3 | Reactions & Comments | 3 |
| 4 | Watch Together Mode | 5 |
| 5 | Video Queue + Upvoting | 5 |
| 6 | Taste Match Score (AI-ish) | 6 |
| 7 | Weekly Recap | 6 |
| 8 | Smart Tagging & Search | 2 |
| 9 | Cross-Platform Login | 1 |
| 10 | Notification Digest | 3 |
| 11 | Video Notes (with timestamps) | 3 |
| 12 | Video Collections + Permission System | 4 |

---

## Phases

### Phase 1 — Foundation & Setup
**Duration:** Week 1–2

The boring-but-necessary stuff. No features. No fun. Just scaffolding.

**Tasks:**
- Initialise Vite + React project with ESLint and Prettier
- Create GitHub repository
- Connect GitHub → Cloudflare Pages for auto-deploy on push to `main`
- Create Firebase project, enable: Firestore, Auth, Realtime DB, Storage
- Implement Firebase Auth: Google OAuth + Apple Sign-In
- Set up React Router with auth-guarded routes
- Build app shell: navigation, layout, loading states

**Deliverable:** A live URL that shows a login screen. That's it. Ship it anyway.

---

### Phase 2 — Rooms & Video Inbox
**Duration:** Week 3–5

The actual product. Paste a link. Watch it appear. Gasp.

**Tasks:**
- Design Firestore data model (rooms, members, videos — see Data Model section)
- Implement room creation with shareable invite links
- Build Universal Video Inbox:
  - Detect platform from pasted URL (YouTube, Instagram, TikTok, X)
  - Fetch preview via YouTube oEmbed API (free, CORS-friendly, no key)
  - Fetch preview via noembed.com for other platforms (free, cross-origin)
  - Render embedded player or thumbnail + link card
- Build real-time room feed using Firestore `onSnapshot` listeners
- Implement client-side smart tagging: extract keywords from video title/description, store as array in Firestore
- Build tag-based search using Firestore `array-contains` queries

**Deliverable:** Users can create rooms, invite others, and share video links that render with previews.

---

### Phase 3 — Social Layer
**Duration:** Week 6–8

Make people actually want to come back.

**Tasks:**
- Emoji reactions: stored as Firestore subcollection `videos/{id}/reactions`
- Text comments: stored as Firestore subcollection `videos/{id}/comments`
- Optimistic UI updates for reactions (update locally, sync in background)
- Video Notes:
  - Attach a note when sharing (or after the fact)
  - Private vs shared toggle per note
  - Timestamp pinning: store `timestampSeconds` field alongside note text
  - @mention parsing: detect `@username` in note text, store as `mentions[]` array
- Notification digest:
  - Track unseen activity per user in Firestore (`users/{id}/notifications`)
  - Show as in-app notification bell (no push — Cloud Functions not available on free tier)
  - Batch and display as a daily digest summary

**Deliverable:** Rooms feel alive. Members can react, comment, and annotate videos.

---

### Phase 4 — Collections & Permissions
**Duration:** Week 9–10

The organised chaos feature. Let people group their videos and control who sees what.

**Tasks:**
- Collections CRUD: create, name, add/remove videos, delete
- Collections stored as Firestore documents with `videoIds[]` array
- Permission system (stored as `permission` field on each collection):
  - `public` — all room members see it
  - `private` — only creator sees it
  - `members` — `allowedUids[]` array, checked client-side and enforced by Firestore rules
  - `sensitive` — visible to allowed members, blurred by default in feed
- Blur overlay UI: CSS `filter: blur(12px)` on sensitive thumbnails, `pointer-events: none` on overlay; tap to reveal toggles local state
- Room-level permission cap: `maxPermission` field on room document; admins set it; Firestore security rules enforce it
- Firestore security rules updated to enforce all permission checks server-side

**Deliverable:** Users can bundle videos into collections with access control. Sensitive content is blurred until revealed.

---

### Phase 5 — Watch Together & Queue
**Duration:** Week 11–13

The feature that makes this a shared experience, not just a shared list.

**Tasks:**
- Watch Together mode:
  - Session document in Firebase Realtime DB: `watchSessions/{roomId}` with `{ videoId, isPlaying, currentTime, hostUid, updatedAt }`
  - One host controls playback; all other clients listen and seek/play/pause to match
  - Detect and handle latency: add 300ms sync delay buffer
  - Live reactions overlay: ephemeral emoji bursts stored in Realtime DB with TTL (`expiresAt` timestamp), cleaned up client-side
- Video Queue:
  - Firestore collection `rooms/{id}/queue` with `{ videoId, addedBy, votes[], addedAt }`
  - Upvote: add `uid` to `votes[]` array (one per user)
  - Queue sorted by `votes.length` descending, then `addedAt` as tiebreaker
  - "Play next" button for room admins

**Deliverable:** Room members can watch videos together in sync, react live, and vote on what plays next.

---

### Phase 6 — AI Features & Polish
**Duration:** Week 14–16

The fun stuff. Also the "let's make this actually shippable" stuff.

**Tasks:**
- Taste Match Score:
  - Aggregate tag arrays from all videos shared by each user in a room
  - Build per-user tag frequency vectors (e.g. `{ "cooking": 5, "memes": 12, "sport": 2 }`)
  - Compute cosine similarity between two users' vectors client-side
  - Display as a percentage score on member profiles within a room
- Weekly Recap:
  - Query last 7 days of videos from Firestore, sort by reaction count
  - Display top 5 as a styled summary card
  - "Share recap" button copies a plain-text summary to clipboard
- PWA setup:
  - Add `manifest.json` (name, icons, theme colour)
  - Register service worker via Vite PWA plugin
  - Show install prompt on mobile
- Performance pass:
  - Lazy-load route components with `React.lazy` + `Suspense`
  - Add Firestore composite indexes for all multi-field queries
  - Run Lighthouse audit, target 90+ on Performance and Accessibility
- Final accessibility pass: keyboard navigation, focus rings, aria labels, colour contrast

**Deliverable:** The app is fast, installable, and has enough personality to feel like a product.

---

## Firestore Data Model

```
users/
  {uid}/
    displayName: string
    photoURL: string
    createdAt: timestamp
    notifications/
      {notifId}/
        type: "reaction" | "comment" | "mention"
        fromUid: string
        roomId: string
        videoId: string
        seen: boolean
        createdAt: timestamp

rooms/
  {roomId}/
    name: string
    createdBy: string (uid)
    members: string[] (uids)
    admins: string[] (uids)
    inviteCode: string
    maxPermission: "public" | "members" | "sensitive"
    createdAt: timestamp

    videos/
      {videoId}/
        url: string
        platform: "youtube" | "instagram" | "tiktok" | "x"
        title: string
        thumbnail: string
        addedBy: string (uid)
        tags: string[]
        createdAt: timestamp

        reactions/
          {uid}: string (emoji)

        comments/
          {commentId}/
            uid: string
            text: string
            createdAt: timestamp

        notes/
          {noteId}/
            uid: string
            text: string
            timestampSeconds: number | null
            isShared: boolean
            mentions: string[] (uids)
            createdAt: timestamp

    collections/
      {collectionId}/
        name: string
        createdBy: string (uid)
        videoIds: string[]
        permission: "public" | "private" | "members" | "sensitive"
        allowedUids: string[]
        createdAt: timestamp

    queue/
      {queueItemId}/
        videoId: string
        addedBy: string (uid)
        votes: string[] (uids)
        addedAt: timestamp

watchSessions/ (Firebase Realtime DB)
  {roomId}/
    videoId: string
    isPlaying: boolean
    currentTime: number
    hostUid: string
    updatedAt: number (timestamp ms)
    reactions/
      {reactionId}/
        uid: string
        emoji: string
        expiresAt: number
```

---

## Free Tier Constraints & Workarounds

| Constraint | Workaround |
|---|---|
| Firestore: 50k reads/day | Use `onSnapshot` listeners (1 read, then streams diffs). Paginate feeds. Cache aggressively in local state. |
| Firestore: 20k writes/day | Batch writes. Debounce reactions (collect 3 seconds of emoji taps → 1 write). |
| No Cloud Functions outbound HTTP | All oEmbed fetching is client-side. No server-side link preview proxy needed. |
| Realtime DB: 100 simultaneous connections | One connection per Watch Together session. Fine for MVP. |
| No push notifications | In-app notification center only (Firestore-based). Clearly communicated to users. |
| Firebase Storage: 5 GB | Store only avatars. Video files are never uploaded — only URLs. |

---

## Deployment Pipeline

```
Developer pushes to main
        ↓
GitHub triggers Cloudflare Pages build
        ↓
Vite builds React SPA (< 60s)
        ↓
Cloudflare Pages deploys to global CDN
        ↓
Live at reelationship.pages.dev (or custom domain)
```

Preview deployments are created automatically for every pull request.

---

## Timeline Summary

| Phase | Focus | Weeks |
|---|---|---|
| 1 | Foundation & Setup | 1–2 |
| 2 | Rooms & Video Inbox | 3–5 |
| 3 | Social Layer | 6–8 |
| 4 | Collections & Permissions | 9–10 |
| 5 | Watch Together & Queue | 11–13 |
| 6 | AI Features & Polish | 14–16 |

**Total: ~16 weeks** to a fully-featured MVP. Solo dev. No budget. All vibes.

---

*Last updated: May 2026*
