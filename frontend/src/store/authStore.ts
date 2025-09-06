// src/store/authStore.ts
import { create } from "zustand";
import { api } from "../services/api";

interface AuthState {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  login: async (email, password) => {
    await api.post("/login", { email, password });
    set({ isLoggedIn: true });
  },

  checkAuth: async () => {
    try {
      await api.get("/auth-me");
      set({ isLoggedIn: true });
    } catch {
      set({ isLoggedIn: false });
    }
  },

  logout: async () => {
    await api.post("/logout");
    set({ isLoggedIn: false });
  },
}));
