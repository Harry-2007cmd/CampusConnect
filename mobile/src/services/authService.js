import { api } from "./api";

// Mirrors backend/app/routers/auth.py + profile.py 1:1.
export async function requestOtp(email) {
  await api.post("/auth/otp/request", { email });
}

export async function verifyOtp(email, code) {
  const { data } = await api.post("/auth/otp/verify", { email, code });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(updates) {
  const { data } = await api.patch("/profile", updates);
  return data;
}
