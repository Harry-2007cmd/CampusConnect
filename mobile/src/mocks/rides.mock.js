// Matches the documented response shape for GET /rides (TASKS.md task 11) and
// GET /rides/:id (task 12, same ride shape + driver info). Swap for real API
// calls in src/services/rideService.js once Track A's endpoint is live.

export const MOCK_RIDES = [
  {
    id: "ride-1",
    driver_id: "user-1",
    driver_name: "Asha Kumar",
    driver_gender: "female",
    origin: "North Campus Hostel",
    destination: "Central Railway Station",
    departure_time: "2026-07-29T08:30:00Z",
    price_per_seat: 60,
    seats_total: 4,
    seats_available: 2,
    gender_preference: "any",
    notes: "Leaving right after breakfast, can wait 10 min max.",
    status: "open",
  },
  {
    id: "ride-2",
    driver_id: "user-2",
    driver_name: "Rohan Mehta",
    driver_gender: "male",
    origin: "Engineering Block",
    destination: "City Mall",
    departure_time: "2026-07-29T18:00:00Z",
    price_per_seat: 40,
    seats_total: 3,
    seats_available: 1,
    gender_preference: "male",
    notes: "",
    status: "open",
  },
  {
    id: "ride-3",
    driver_id: "user-3",
    driver_name: "Priya Nair",
    driver_gender: "female",
    origin: "Girls Hostel Gate 2",
    destination: "Airport Terminal 1",
    departure_time: "2026-07-30T05:00:00Z",
    price_per_seat: 250,
    seats_total: 3,
    seats_available: 3,
    gender_preference: "female",
    notes: "Early morning flight run, please be on time.",
    status: "open",
  },
  {
    id: "ride-4",
    driver_id: "user-4",
    driver_name: "Dev Singh",
    driver_gender: "male",
    origin: "Library Circle",
    destination: "Tech Park Phase 2",
    departure_time: "2026-07-29T09:15:00Z",
    price_per_seat: 30,
    seats_total: 4,
    seats_available: 0,
    gender_preference: "any",
    notes: "Daily commute, recurring.",
    status: "open",
  },
];

export function findMockRideById(id) {
  return MOCK_RIDES.find((ride) => ride.id === id) ?? null;
}
