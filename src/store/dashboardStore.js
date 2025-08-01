import { create } from "zustand";
export const useDashboardStore = create((set, get) => ({
    stats: null,
    loading: false,
    error: null,
    timeRange: "month",
    fetchDashboardData: async () => {
        if (get().loading)
            return;
        set({ loading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const mockStats = {
                totalBooks: 1245,
                availableBooks: 876,
                totalMembers: 342,
                activeMembers: 289,
                totalBorrowed: 124,
                overdueBooks: 17,
                recentTransactions: [],
                popularBooks: [],
                monthlyStats: [],
            };
            set({ stats: mockStats, loading: false });
        }
        catch (error) {
            set({
                error: error.message || "Failed to fetch dashboard data",
                loading: false,
            });
        }
    },
    setTimeRange: (range) => {
        set({
            timeRange: range,
            loading: true,
        });
        get().fetchDashboardData();
    },
    refreshData: async () => {
        await get().fetchDashboardData();
    },
    clearError: () => {
        set({ error: null });
    },
}));
