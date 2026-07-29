import { api } from "./api";
import { mockRequestOtp, mockVerifyOtp, mockGetMe, mockUpdateProfile } from "../mocks/auth.mock";

// Backend is live as of task 31 — flip back to true only if working offline against mocks.
// Mirrors backend/app/routers/auth.py + profile.py 1:1.
const USE_MOCKS = false;

export async function requestOtp(email) {
  if (USE_MOCKS) return mockRequestOtp(email);
  await api.post("/auth/otp/request", { email });
}

export async function verifyOtp(email, code) {
  if (USE_MOCKS) return mockVerifyOtp(email, code);
  const { data } = await api.post("/auth/otp/verify", { email, code });
  return data;
}

export async function getMe(token) {
  if (USE_MOCKS) return mockGetMe(token);
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(token, updates) {
  if (USE_MOCKS) return mockUpdateProfile(token, updates);
  const { data } = await api.patch("/profile", updates);
  return data;
}
