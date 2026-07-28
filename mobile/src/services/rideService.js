import api from "./api";
import { MOCK_RIDES, findMockRideById } from "../mocks/rides.mock";

// Mirrors backend/app/routers/rides.py 1:1 (TASKS.md tasks 10-16). Currently
// backed by src/mocks/rides.mock.js — swap the body of each function for the
// real `api.get/post` call once Track A's endpoints are live (task 27).
const USE_MOCKS = true;

function matchesFilters(ride, filters) {
  const { origin, destination, maxPrice, genderPref } = filters;

  if (origin && !ride.origin.toLowerCase().includes(origin.toLowerCase())) {
    return false;
  }
  if (
    destination &&
    !ride.destination.toLowerCase().includes(destination.toLowerCase())
  ) {
    return false;
  }
  if (maxPrice != null && ride.price_per_seat > maxPrice) {
    return false;
  }
  if (genderPref && genderPref !== "any" && ride.gender_preference !== "any") {
    if (ride.gender_preference !== genderPref) {
      return false;
    }
  }
  return true;
}

export async function getRides(filters = {}) {
  if (USE_MOCKS) {
    return MOCK_RIDES.filter((ride) => matchesFilters(ride, filters));
  }
  const { origin, destination, maxPrice, genderPref } = filters;
  const { data } = await api.get("/rides", {
    params: {
      origin: origin || undefined,
      destination: destination || undefined,
      max_price: maxPrice ?? undefined,
      gender_pref: genderPref || undefined,
    },
  });
  return data;
}

export async function getRideById(id) {
  if (USE_MOCKS) {
    return findMockRideById(id);
  }
  const { data } = await api.get(`/rides/${id}`);
  return data;
}

export async function requestSeat(id) {
  if (USE_MOCKS) {
    return { id: `req-${id}`, ride_id: id, status: "pending" };
  }
  const { data } = await api.post(`/rides/${id}/request`);
  return data;
}
