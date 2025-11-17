import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // your FastAPI URL
  withCredentials: true, // only if using auth cookies
});
