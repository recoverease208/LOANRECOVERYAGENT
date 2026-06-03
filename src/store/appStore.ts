import { create } from "zustand";
import type { UserRole } from "@/types/domain";

interface AppState {
  role: UserRole;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: "super_admin",
  sidebarCollapsed: false,
  darkMode: false,
  setRole: (role) => set({ role }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDarkMode: () =>
    set((state) => {
      document.documentElement.classList.toggle("dark", !state.darkMode);
      return { darkMode: !state.darkMode };
    })
}));
