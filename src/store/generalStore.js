import { create } from "zustand";
const lightTheme = {
    primary: "#4f46e5",
    secondary: "#7c3aed",
    background: "#f9fafb",
    text: "#111827",
    error: "#dc2626",
    success: "#059669",
    warning: "#d97706",
    info: "#0284c7",
};
const darkTheme = {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    background: "#111827",
    text: "#f9fafb",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
};
export const useGeneralStore = create((set, get) => ({
    theme: "light",
    colors: lightTheme,
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    currentPageTitle: "Dashboard",
    isLoading: false,
    notification: {
        message: "",
        type: "info",
        show: false,
    },
    toggleTheme: () => {
        set((state) => {
            const newTheme = state.theme === "light" ? "dark" : "light";
            return {
                theme: newTheme,
                colors: newTheme === "light" ? lightTheme : darkTheme,
            };
        });
    },
    toggleSidebar: () => {
        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen,
        }));
    },
    toggleMobileMenu: () => {
        set((state) => ({
            isMobileMenuOpen: !state.isMobileMenuOpen,
        }));
    },
    setPageTitle: (title) => {
        set({ currentPageTitle: title });
    },
    showNotification: (message, type = "info") => {
        set({
            notification: {
                message,
                type,
                show: true,
            },
        });
        setTimeout(() => {
            const currentNotification = get().notification;
            if (currentNotification.show && currentNotification.message === message) {
                get().hideNotification();
            }
        }, 5000);
    },
    hideNotification: () => {
        set((state) => ({
            notification: {
                ...state.notification,
                show: false,
            },
        }));
    },
    setLoading: (isLoading) => {
        set({ isLoading });
    },
}));
