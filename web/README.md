# CampusConnect — Web

Browser-based frontend for CampusConnect (Vite + React + `react-router-dom`).

This is a faithful port of the original React Native + Expo app in `../mobile` — same
features, same screens, same user flow, same design tokens (`docs/DESIGN.md` / D-014).
See **D-016** in `docs/DECISIONS.md` for the platform change and the mobile → web mapping.

## Prerequisites

- Node.js 18+ and npm
- The FastAPI backend running (see `../backend`). CORS for this origin is enabled there.

## Setup

```bash
cp .env.example .env   # set VITE_API_URL if the backend isn't on http://localhost:8000
npm install
npm run dev            # dev server on http://localhost:5173
```

`npm run build` produces a static bundle in `dist/`; `npm run preview` serves it locally.

## User flow (unchanged from mobile)

1. **Welcome** → Get Started
2. **Email entry** (`.edu` required) → sends OTP
3. **OTP entry** → verifies, stores JWT in `localStorage`
4. **Profile setup** (name, year, department, gender) — shown until the profile is complete
5. **Browse Rides** (landing) with price/place/gender filters →
   - **Ride Detail** → Request Seat
   - **Offer a ride**
   - **My Rides** (Driving / Riding tabs, accept/decline requests)
   - **Feed** (post, list, upvote)

## Structure

Mirrors `../mobile/src` one-to-one:

```
src/
├── App.jsx                # auth-gated routing (was mobile's RootNavigator.jsx)
├── main.jsx               # BrowserRouter + AuthProvider mount
├── theme/tokens.js        # D-014 design tokens (verbatim)
├── context/AuthContext.jsx
├── hooks/                 # useAuth, useRides
├── services/              # api, authService, postService, rideService (1:1 with backend routers)
├── components/            # common/, carpool/, feed/
└── screens/               # auth/, profile/, carpool/, feed/
```

## Platform swaps vs. mobile

| Mobile (Expo)                     | Web                                  |
| --------------------------------- | ------------------------------------ |
| React Navigation                  | `react-router-dom` (`App.jsx`)       |
| `expo-secure-store`               | `localStorage`                       |
| `View`/`Text`/`Pressable`/…       | HTML elements + CSS                  |
| `Alert.alert`                     | `window.alert`                       |
| `EXPO_PUBLIC_API_URL`             | `VITE_API_URL`                       |
