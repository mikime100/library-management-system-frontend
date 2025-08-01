import { create } from "zustand";
import api from "@/lib/api";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "librarian";
  joinDate?: string;
  status: "active" | "inactive";
  lastLogin?: string;
  image?: string;
}

interface StaffStore {
  staff: StaffMember[];
  selectedStaff: StaffMember | null;
  loading: boolean;
  error: string | null;

  fetchStaff: () => Promise<void>;
  addStaff: (
    staff: Omit<StaffMember, "id" | "joinDate" | "status">
  ) => Promise<void>;
  updateStaff: (
    id: string,
    updates: Partial<Omit<StaffMember, "id">>
  ) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  selectStaff: (staff: StaffMember | null) => void;
  clearError: () => void;
}

export const useStaffStore = create<StaffStore>((set) => ({
  staff: [],
  selectedStaff: null,
  loading: false,
  error: null,

  fetchStaff: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/staff");
      const mockStaff: StaffMember[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          joinDate: "2023-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "librarian",
          joinDate: "2023-02-20",
          status: "active",
        },
      ];

      set({ staff: mockStaff, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch staff",
        loading: false,
      });
    }
  },

  addStaff: async (staff) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/staff", staff);

      const newStaff: StaffMember = {
        ...staff,
        id: Math.random().toString(36).substr(2, 9),
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
      };

      set((state) => ({
        staff: [...state.staff, newStaff],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to add staff",
        loading: false,
      });
      throw error;
    }
  },

  updateStaff: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/staff/${id}`, updates);

      set((state) => ({
        staff: state.staff.map((staff) =>
          staff.id === id ? { ...staff, ...updates } : staff
        ),
        selectedStaff:
          state.selectedStaff?.id === id
            ? { ...state.selectedStaff, ...updates }
            : state.selectedStaff,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update staff",
        loading: false,
      });
      throw error;
    }
  },

  deleteStaff: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/staff/${id}`);

      set((state) => ({
        staff: state.staff.filter((staff) => staff.id !== id),
        selectedStaff:
          state.selectedStaff?.id === id ? null : state.selectedStaff,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete staff",
        loading: false,
      });
      throw error;
    }
  },

  selectStaff: (staff) => {
    set({ selectedStaff: staff });
  },

  clearError: () => {
    set({ error: null });
  },
}));
