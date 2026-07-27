# CampusConnect

A mobile-first networking app for a single university, connecting students across years and departments.

## Status
📋 **Planning phase.** No code has been written yet. Product and technical design is happening first — see `DECISIONS.md` and `TASKS.md`.

## Product Vision
CampusConnect helps students at one university discover and connect with each other across year groups and departments — starting with a shared community feed, with networking-adjacent features (carpool, messaging, search) layered in once the core feed proves useful.

## Scope (current)
- **Platform:** Mobile app (not a website). Backend will be API-first to support this.
- **Audience:** Students at a single university, for now. Schema will be designed to support multiple universities later without a rewrite, but multi-campus logic is explicitly out of scope for now.
- **Team:** Small team (2-4 people).

## The Hook
The core reason this app exists: **a Reddit-style community feed** for the university (posts, upvotes, comments, tagged categories like Academics, Placements, Lost & Found, Hostel, Events, etc.). Everything else in the roadmap exists to support or extend this.

## MVP (revised)
The original roadmap listed 7 phases (Auth → Profile → Community → Carpool → Search → Messaging → Notifications). We've re-sequenced this: the true MVP is the smallest thing needed to prove the feed has value.

**In MVP:**
1. Auth (registration, login, university email verification)
2. Student Profile (name, year, department, interests, skills, clubs, photo)
3. Community Feed (posts, upvotes, comments, tags/categories, basic reporting/moderation)

**Explicitly deferred (v2+, only if MVP gets traction):**
- Carpool
- Global search (students/clubs/posts/rides)
- Messaging
- Notifications

**Explicitly out of scope (per original "don't build" list):**
- AI chatbot, recommendation engine, video/voice calls, live location sharing, payment gateway, admin analytics dashboards, microservices, Kubernetes, Docker Swarm.

## Documentation Map
- `README.md` — this file, project overview and current scope
- `CLAUDE.md` — technical context and conventions for AI-assisted development
- `DECISIONS.md` — architectural and product decisions with rationale
- `CHANGELOG.md` — chronological log of what changed and when
- `TASKS.md` — implementation task breakdown (populated once a feature's full design — DB, API, UX, security, edge cases — is complete)
