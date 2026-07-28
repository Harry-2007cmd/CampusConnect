# DESIGN.md

Shared visual language for CampusConnect's hackathon build. Read this before building any screen. Logged as D-014 in `DECISIONS.md`.

**Why this exists:** three people are building screens in parallel across two branches (`mobile-carpool`, `mobile-core`). Without a shared baseline, Carpool and Feed/Auth/Profile screens will visually diverge, and the Day 3 UX polish pass (task 34) — which is what the 30-point UX rubric category actually rewards — will spend time reconciling inconsistency instead of refining. This doc is deliberately small: enough to keep screens consistent, not a full brand system.

**Direction:** Warm & friendly. Rounded, approachable, campus-community feel — not corporate, not sterile. Students should feel like this is a tool built by their own campus community, not an enterprise app.

---

## Color Roles

Define these as named tokens (theme file / constants), never hardcoded hex per screen.

| Role | Use | Value |
|---|---|---|
| `primary` | Main CTAs (Request Seat, Post, Continue) | `#FF7A59` (warm coral) |
| `primaryPressed` | Pressed/active state of primary | `#E85F3D` |
| `secondary` | Secondary actions, links, active filter chips | `#3D8BFF` (warm-leaning blue) |
| `success` | Accepted request, confirmation states | `#4CAF7D` |
| `warning` | Gender mismatch, seat-full, non-blocking alerts | `#F2A93B` |
| `error` | Failed request, validation errors | `#E85D5D` |
| `textPrimary` | Body text, headings | `#2B2420` (warm near-black, not pure black) |
| `textSecondary` | Timestamps, helper text, placeholders | `#8A7F76` |
| `background` | Screen background | `#FFF8F3` (warm off-white, not pure white) |
| `surface` | Cards, inputs | `#FFFFFF` |
| `border` | Dividers, input borders | `#EDE2D9` |

Only these roles. No one-off colors per screen — if a new color is needed, add it here first.

## Typography

- Use the system font with rounded characteristics where available (e.g. system default on iOS/Android is fine — don't add a custom font unless someone has spare time on Day 3).
- Weight scale: Regular (body), Semibold (headings, button labels), Bold (screen titles only).
- Size scale: 12 (caption/meta) / 14 (body small) / 16 (body) / 20 (subheading) / 24 (screen title).
- Avoid all-caps labels — reads as corporate, not friendly.

## Spacing Scale

Use only: **4 / 8 / 12 / 16 / 24 / 32** (px or dp). No arbitrary values like 10 or 18.

- 4 — tight internal spacing (icon-to-label)
- 8 — internal padding within small components
- 16 — default padding, gap between related elements
- 24 — gap between distinct sections
- 32 — top-level screen padding, major section breaks

## Corner Radius

Warm & friendly = generous rounding, not sharp corners.

- Buttons: fully rounded (pill shape)
- Cards (`RideCard`, `PostCard`): 16px
- Inputs, chips, toggles: 12px
- Avatars: fully circular

## Core Components

**Button (primary/secondary/ghost):** pill-shaped, `primary` fill for main action, `secondary` outline for secondary, text-only ghost for tertiary (e.g. "Cancel"). Minimum touch target 44px height.

**Card (`RideCard`, `PostCard`):** `surface` background, 16px radius, 16px internal padding, subtle border in `border` color rather than heavy shadow — keeps the "friendly" feel light rather than skeuomorphic.

**FilterBar / chips / `GenderToggle`:** pill-shaped toggle chips, `secondary` color when active, `border` color when inactive. Never gray-out or hide options — all filter states stay visibly tappable.

**Input fields:** 12px radius, `border` colored border, `background` fill, `textSecondary` placeholder text.

## Required States (every screen that loads or lists data)

Every screen touching async data (Browse Rides, Ride Detail, Feed list, My Rides) must implement all three — this is explicitly judged in task 34, so build it once now rather than patching it in on Day 3:

1. **Loading state** — simple skeleton or spinner, not a blank screen.
2. **Empty state** — friendly, specific copy (e.g. "No rides match your filters yet — try widening your price range" rather than generic "No data"). Use `common/EmptyState`.
3. **Error state** — plain-language message + retry action, never a raw error code shown to the user.

## What's explicitly NOT covered here

Full brand identity, icon set, illustration style, dark mode, animation/motion spec. If Day 3 leaves time, these can be layered in — they are not blocking for the demo.