import { create } from "zustand";
import api from "../lib/api";
const getStoredUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    catch (error) {
        console.error("Error parsing stored user:", error);
        return null;
    }
};
export const useUserStore = create((set) => ({
    user: getStoredUser(),
    isAuthenticated: !!getStoredUser(),
    error: null,
    loading: false,
    login: async ({ email, password }) => {
        try {
            set({ loading: true, error: null, isAuthenticated: false, user: null });
            const response = await api.post("https://back-end-for-assessment.vercel.app/auth/login", { email, password });
            if ((response.status === 200 || response.status === 201) &&
                response.data?.user &&
                response.data?.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.access_token);
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
                return { success: true };
            }
            throw new Error("Invalid response from server");
        }
        catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "An error occurred during login.";
            set({
                error: errorMessage,
                loading: false,
                isAuthenticated: false,
                user: null,
            });
            return { success: false };
        }
    },
    signup: async ({ email, username, password, role = "USER" }) => {
        try {
            set({ loading: true, error: null, isAuthenticated: false, user: null });
            const response = await api.post("https://back-end-for-assessment.vercel.app/auth/signup", {
                email,
                username,
                password,
                role,
            });
            if (response.status === 201) {
                set({
                    user: {
                        email,
                        username,
                        role,
                        ...response.data.user,
                    },
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
                const token = response.data.access_token || response.data.token;
                if (token) {
                    localStorage.setItem("token", token);
                }
                return { success: true };
            }
            throw new Error(response.data?.message || "Signup failed. Please try again.");
        }
        catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "An error occurred during signup.";
            set({
                error: errorMessage,
                loading: false,
                isAuthenticated: false,
                user: null,
            });
            return { success: false };
        }
    },
    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
    },
}));
