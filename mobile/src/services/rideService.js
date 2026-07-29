import { api } from "./api";

// Mirrors backend/app/routers/rides.py 1:1 (TASKS.md tasks 10-16).
export async function getRides(filters = {}) {
  const { origin, destination, maxPrice, genderPref } = filters;
  const { data } = await api.get("/rides", {
    params: {
      origin: origin || undefined,
      destination: destination || undefined,
      max_price: maxPrice ?? undefined,
      gender_pref: genderPref && genderPref !== "any" ? genderPref : undefined,
    },
  });
  return data;
}

export async function getRideById(id) {
  const { data } = await api.get(`/rides/${id}`);
  return data;
}

export async function requestSeat(id) {
  const { data } = await api.post(`/rides/${id}/request`);
  return data;
}

export async function createRide(payload) {
  const { data } = await api.post("/rides", payload);
  return data;
}

export async function getMyRides() {
  const { data } = await api.get("/rides/mine");
  return data;
}

export async function acceptRequest(rideId, requestId) {
  const { data } = await api.post(`/rides/${rideId}/requests/${requestId}/accept`);
  return data;
}

export async function declineRequest(rideId, requestId) {
  const { data } = await api.post(`/rides/${rideId}/requests/${requestId}/decline`);
  return data;
}
