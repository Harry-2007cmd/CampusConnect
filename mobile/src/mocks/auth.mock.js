// Mocked responses matching Track A's documented shapes (TASKS.md tasks 4-8).
// Swap for real api.js calls in authService.js once backend/auth endpoints are live.

const MOCK_DELAY_MS = 600;
const MOCK_OTP = "123456";

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

// In-memory "database" for the mock session only.
const mockUsersByEmail = new Map();

export function mockRequestOtp(email) {
  if (!email.endsWith(".edu")) {
    return delay(Promise.reject(new Error("Please use your university (.edu) email.")));
  }
  return delay({}); // POST /auth/otp/request -> 200, no body
}

export function mockVerifyOtp(email, code) {
  if (code !== MOCK_OTP) {
    return Promise.reject(new Error("Incorrect code. Please try again."));
  }

  let user = mockUsersByEmail.get(email);
  const isNewUser = !user;
  if (!user) {
    user = {
      id: `mock-${Date.now()}`,
      email,
      name: null,
      year: null,
      department: null,
      gender: null,
    };
    mockUsersByEmail.set(email, user);
  }

  return delay({
    access_token: `mock-token-${user.id}`,
    user,
    isNewUser,
  });
}

export function mockGetMe(token) {
  const user = Array.from(mockUsersByEmail.values()).find((u) => `mock-token-${u.id}` === token);
  if (!user) {
    return Promise.reject(new Error("Session expired. Please log in again."));
  }
  return delay(user);
}

export function mockUpdateProfile(token, updates) {
  const user = Array.from(mockUsersByEmail.values()).find((u) => `mock-token-${u.id}` === token);
  if (!user) {
    return Promise.reject(new Error("Session expired. Please log in again."));
  }
  Object.assign(user, updates);
  return delay({ ...user });
}
