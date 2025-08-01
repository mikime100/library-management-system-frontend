import { create } from "zustand";
import api from "@/lib/api";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate?: string;
  borrowedBooks: number;
  status: "active" | "inactive";
  image?: string;
}

interface MemberStore {
  members: Member[];
  selectedMember: Member | null;
  loading: boolean;
  error: string | null;

  fetchMembers: () => Promise<void>;
  addMember: (
    member: Omit<Member, "id" | "joinDate" | "status" | "borrowedBooks">
  ) => Promise<void>;
  updateMember: (
    id: string,
    updates: Partial<Omit<Member, "id">>
  ) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  selectMember: (member: Member | null) => void;
  clearError: () => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  selectedMember: null,
  loading: false,
  error: null,

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/members");
      const mockMembers: Member[] = [
        {
          id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          phone: "555-0101",
          joinDate: "2023-03-10",
          borrowedBooks: 2,
          status: "active",
        },
        {
          id: "2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          phone: "555-0102",
          joinDate: "2023-04-15",
          borrowedBooks: 1,
          status: "active",
        },
      ];

      set({ members: mockMembers, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch members",
        loading: false,
      });
    }
  },

  addMember: async (member) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/members", member);

      const newMember: Member = {
        ...member,
        id: `member-${Date.now()}`,
        borrowedBooks: 0,
        status: "active",
      };

      set((state) => ({
        members: [...state.members, newMember],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to add member",
        loading: false,
      });
      throw error;
    }
  },

  updateMember: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/members/${id}`, updates);

      set((state) => ({
        members: state.members.map((member) =>
          member.id === id ? { ...member, ...updates } : member
        ),
        selectedMember:
          state.selectedMember?.id === id
            ? { ...state.selectedMember, ...updates }
            : state.selectedMember,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update member",
        loading: false,
      });
      throw error;
    }
  },

  deleteMember: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/members/${id}`);

      set((state) => ({
        members: state.members.filter((member) => member.id !== id),
        selectedMember:
          state.selectedMember?.id === id ? null : state.selectedMember,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete member",
        loading: false,
      });
      throw error;
    }
  },

  selectMember: (member) => {
    set({ selectedMember: member });
  },

  clearError: () => {
    set({ error: null });
  },
}));
