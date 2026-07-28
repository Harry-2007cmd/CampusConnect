import axios from "axios";

// No auth interceptor yet — AuthContext.jsx (Track C) isn't wired up. Add the
// JWT bearer interceptor here once real endpoints are live and auth exists.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
  timeout: 10000,
});

export default api;
