import axios from "axios";

export const api = axios.create({
  baseURL: "https://gym-backend.artechnology.pro/api/admin",
  withCredentials: true,
});
