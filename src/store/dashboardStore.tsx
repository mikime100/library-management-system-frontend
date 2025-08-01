import { create } from "zustand";

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  totalMembers: number;
  activeMembers: number;
  totalBorrowed: number;
  overdueBooks: number;
  recentTransactions: Array<{
    id: string;
    bookTitle: string;
    memberName: string;
    type: "borrow" | "return";
    date: string;
  }>;
  popularBooks: Array<{
    id: string;
    title: string;
    author: string;
    borrowCount: number;
  }>;
  monthlyStats: Array<{
    month: string;
    borrows: number;
    returns: number;
  }>;
}

interface DashboardStore {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  timeRange: "week" | "month" | "year";

  fetchDashboardData: () => Promise<void>;
  setTimeRange: (range: "week" | "month" | "year") => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  loading: false,
  error: null,
  timeRange: "month",

  fetchDashboardData: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockStats: DashboardStats = {
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
    } catch (error: any) {
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
