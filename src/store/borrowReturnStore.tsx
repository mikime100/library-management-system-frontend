import { create } from "zustand";
import api from "@/lib/api";

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned" | "overdue";
  fineAmount: number;
}

interface BorrowReturnStore {
  borrowRecords: BorrowRecord[];
  currentBorrows: BorrowRecord[];
  overdueBorrows: BorrowRecord[];
  selectedRecord: BorrowRecord | null;
  loading: boolean;
  error: string | null;

  fetchBorrowRecords: () => Promise<void>;
  borrowBook: (params: {
    bookId: string;
    bookTitle: string;
    memberId: string;
    memberName: string;
    dueDate: string;
  }) => Promise<{ success: boolean }>;
  returnBook: (
    borrowId: string,
    fineAmount?: number
  ) => Promise<{ success: boolean }>;
  renewBook: (
    borrowId: string,
    newDueDate: string
  ) => Promise<{ success: boolean }>;
  calculateFine: (borrowId: string) => number;
  selectRecord: (record: BorrowRecord | null) => void;
  clearError: () => void;
}

export const useBorrowReturnStore = create<BorrowReturnStore>((set, get) => ({
  borrowRecords: [],
  currentBorrows: [],
  overdueBorrows: [],
  selectedRecord: null,
  loading: false,
  error: null,

  fetchBorrowRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/borrow-records");
      const borrowRecords: BorrowRecord[] = res.data.map((r: any) => {
        const now = new Date();
        const due = new Date(r.due_date ?? r.dueDate);
        let status: "borrowed" | "returned" | "overdue" = "borrowed";
        const returnDate = r.return_date ?? r.returnDate;
        if (returnDate) status = "returned";
        else if (due < now) status = "overdue";
        return {
          id: r.id,
          bookId: r.book?.id?.toString() ?? r.bookId?.toString() ?? "",
          bookTitle: r.book?.title ?? r.bookTitle ?? "",
          memberId: r.member?.id?.toString() ?? r.memberId?.toString() ?? "",
          memberName: r.member?.name ?? r.memberName ?? "",
          borrowDate: r.borrow_date ?? r.borrowDate,
          dueDate: r.due_date ?? r.dueDate,
          returnDate,
          status,
          fineAmount: r.fineAmount,
        };
      });
      const filteredRecords = borrowRecords.filter((r) => r.id);
      const now = new Date();
      const currentBorrows = filteredRecords.filter(
        (record) => !record.returnDate && new Date(record.dueDate) >= now
      );
      const overdueBorrows = filteredRecords.filter(
        (record) => !record.returnDate && new Date(record.dueDate) < now
      );
      set({
        borrowRecords: filteredRecords,
        currentBorrows,
        overdueBorrows,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch borrow records",
        loading: false,
      });
    }
  },

  borrowBook: async (payload) => {
    set({ loading: true, error: null });
    try {
      await api.post("/borrow-records/borrow", payload);
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      set({
        error: error.message || "Failed to process book checkout",
        loading: false,
      });
      return { success: false };
    }
  },

  returnBook: async (borrowId) => {
    set({ loading: true, error: null });
    try {
      await api.post("/borrow-records/return", {
        borrow_record_id: Number(borrowId),
      });
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error.message || "Failed to process book return",
        loading: false,
      }));
      return { success: false };
    }
  },

  renewBook: async (borrowId, newDueDate) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const status: "borrowed" = "borrowed";
      set((state) => {
        const updatedRecords = state.borrowRecords.map((record) =>
          record.id === borrowId
            ? {
                ...record,
                dueDate: newDueDate,
                status,
              }
            : record
        );
        const updatedBorrow = updatedRecords.find((r) => r.id === borrowId);
        return {
          ...state,
          borrowRecords: updatedRecords,
          currentBorrows: updatedBorrow
            ? [
                ...state.currentBorrows.filter((r) => r.id !== borrowId),
                updatedBorrow,
              ]
            : state.currentBorrows,
          overdueBorrows: state.overdueBorrows.filter((r) => r.id !== borrowId),
          loading: false,
        };
      });
      return { success: true };
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error.message || "Failed to renew book",
        loading: false,
      }));
      return { success: false };
    }
  },

  calculateFine: (borrowId) => {
    const record = get().borrowRecords.find((r) => r.id === borrowId);
    if (!record || record.returnDate) return 0;
    const dueDate = new Date(record.dueDate);
    const today = new Date();
    if (today <= dueDate) return 0;
    const diffTime = Math.ceil(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const finePerDay = 0.5;
    return Math.min(diffTime * finePerDay, 20);
  },

  selectRecord: (record) => {
    set({ selectedRecord: record });
  },

  clearError: () => {
    set({ error: null });
  },
}));
