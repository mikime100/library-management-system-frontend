import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Users,
  Clock,
  AlertCircle,
  Shield,
  Plus,
  Repeat,
  BarChart2,
  UserPlus,
  Tag,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import OverdueBooks from "@/components/dashboard/OverdueBooks";
import PopularGenres from "@/components/dashboard/PopularGenres";
import { useUserStore } from "@/store/userStore";
import { useBorrowReturnStore } from "@/store/borrowReturnStore";
import { Link, Navigate } from "react-router-dom";
import api from "@/lib/api";
import { fetchMembers } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import MemberForm from "@/components/members/MemberForm";
import BookForm from "@/components/books/BookForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const fetchBooks = async () => {
  const { data } = await api.get("/books");
  if (data && Array.isArray(data.books)) return data.books;
  if (Array.isArray(data)) return data;
  return [];
};
const fetchGenres = async () => {
  const { data } = await api.get("/genres");
  if (data && Array.isArray(data.genres)) return data.genres;
  if (Array.isArray(data)) return data;
  return [];
};

export default function Dashboard() {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const {
    data: books = [],
    isLoading: booksLoading,
    error: booksError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });
  const {
    data: genres = [],
    isLoading: genresLoading,
    error: genresError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const {
    borrowRecords,
    overdueBorrows,
    loading: borrowLoading,
    error: borrowError,
    fetchBorrowRecords,
    borrowBook,
    returnBook,
  } = useBorrowReturnStore();

  const queryClient = useQueryClient();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [borrowForm, setBorrowForm] = useState({
    bookId: "",
    memberId: "",
    dueDate: "",
  });
  const [returnForm, setReturnForm] = useState({ borrowId: "" });
  const [borrowModalError, setBorrowModalError] = useState("");
  const [returnModalError, setReturnModalError] = useState("");

  useEffect(() => {
    fetchBorrowRecords();
  }, [fetchBorrowRecords]);

  const openBorrowModal = () => {
    setBorrowForm({ bookId: "", memberId: "", dueDate: "" });
    setBorrowModalError("");
    setShowBorrowModal(true);
  };
  const openReturnModal = () => {
    setReturnForm({ borrowId: "" });
    setReturnModalError("");
    setShowReturnModal(true);
  };
  const openAddMemberModal = () => setShowAddMemberModal(true);
  const openAddBookModal = () => setShowAddBookModal(true);
  const closeBorrowModal = () => setShowBorrowModal(false);
  const closeReturnModal = () => setShowReturnModal(false);
  const closeAddMemberModal = () => setShowAddMemberModal(false);
  const closeAddBookModal = () => setShowAddBookModal(false);

  const handleBorrow = async () => {
    setBorrowModalError("");
    try {
      const selectedBook = safeBooks.find((b) => b.id === borrowForm.bookId);
      const selectedMember = safeMembers.find(
        (m) => m.id === borrowForm.memberId
      );
      await borrowBook({
        bookId: borrowForm.bookId,
        bookTitle: selectedBook?.title ?? "",
        memberId: borrowForm.memberId,
        memberName: selectedMember?.name ?? "",
        dueDate: borrowForm.dueDate,
      });
      closeBorrowModal();
      fetchBorrowRecords();
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (err: any) {
      setBorrowModalError(err?.message || "Failed to borrow book");
    }
  };
  const handleReturn = async () => {
    setReturnModalError("");
    try {
      await returnBook(returnForm.borrowId);
      closeReturnModal();
      fetchBorrowRecords();
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (err: any) {
      setReturnModalError(err?.message || "Failed to return book");
    }
  };

  useEffect(() => {
    fetchBorrowRecords();
  }, []);

  const isLoading =
    booksLoading || membersLoading || genresLoading || borrowLoading;
  const error = booksError || membersError || genresError || borrowError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching dashboard data:", error);
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load dashboard data. Please try again later.
              <br />
              <span style={{ fontSize: "0.8em", color: "#555" }}>
                {String(error)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const safeBooks = Array.isArray(books) ? books : [];
  const safeMembers = Array.isArray(members) ? members : [];
  const safeBorrowRecords = Array.isArray(borrowRecords) ? borrowRecords : [];
  const safeOverdueBorrows = Array.isArray(overdueBorrows)
    ? overdueBorrows
    : [];

  const totalBooks = safeBooks.length;
  const totalMembers = safeMembers.length;
  const totalBorrowed = safeBorrowRecords.filter(
    (r) => r && !r.returnDate
  ).length;
  const overdueBooks = safeOverdueBorrows.length;
  const totalReturned = safeBorrowRecords.filter(
    (r) => r && r.returnDate
  ).length;
  const totalBorrows = safeBorrowRecords.length;
  const returnRate =
    totalBorrows > 0 ? Math.round((totalReturned / totalBorrows) * 100) : 0;

  type Book = { genre: string | string[] };
  const genreCount = (safeBooks as Book[]).reduce(
    (acc: Record<string, number>, book: Book) => {
      if (Array.isArray(book.genre)) {
        book.genre.forEach((g: string) => {
          acc[g] = (acc[g] || 0) + 1;
        });
      } else if (book.genre) {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  const popularGenres = Object.entries(genreCount)
    .map(([name, count]) => ({ name, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (
    totalBooks === 0 &&
    totalMembers === 0 &&
    totalBorrowed === 0 &&
    overdueBooks === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <h2 className="text-xl font-semibold mb-2">
          No dashboard data available
        </h2>
        <p>Please add books, members, or borrow records to see statistics.</p>
      </div>
    );
  }

  const recentActivity = borrowRecords.slice(0, 5).map((record) => ({
    type: record.returnDate ? "return" : "borrow",
    book: record.bookTitle || "Unknown Book",
    member: record.memberName || "Unknown Member",
    date: new Date(record.returnDate || record.borrowDate).toLocaleDateString(),
  }));

  const role = user?.role || "admin";
  const isAdmin = role === "admin";
  const isLibrarian = role === "librarian";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {isAdmin
                ? "Admin Dashboard"
                : isLibrarian
                ? "Librarian Dashboard"
                : "Dashboard"}
            </h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-black text-white border border-gray-300"
              }`}
            >
              {isAdmin ? (
                <Shield className="h-4 w-4 mr-1" />
              ) : (
                <UserPlus className="h-4 w-4 mr-1" />
              )}{" "}
              {role.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-500 text-base">
            {isAdmin
              ? "Full system access - Manage all library operations"
              : isLibrarian
              ? "Standard library operations - Books, members, and borrowing"
              : "Overview of your library's performance and statistics."}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">
            Welcome, {user?.name || "admin"}
          </span>
        </div>
      </div>
      {isAdmin ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center gap-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Administrator Access</p>
            <p className="text-red-600 text-sm">
              You have full system privileges including delete operations, genre
              management, and staff administration.
            </p>
          </div>
        </div>
      ) : isLibrarian ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-center gap-4">
          <UserPlus className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-700">Librarian Access</p>
            <p className="text-green-700 text-sm">
              You can manage books and members, handle borrowing operations, and
              view reports. Contact admin for advanced operations.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={BookOpen}
          trend="up"
          trendValue="12%"
          trendLabel="All books in system"
        />
        <StatCard
          title="Total Members"
          value={totalMembers}
          icon={Users}
          trend="up"
          trendValue="5%"
          trendLabel="All members in system"
        />
        <StatCard
          title="Active Borrows"
          value={totalBorrowed}
          icon={Repeat}
          trend="neutral"
          trendLabel="Currently borrowed"
        />
        <StatCard
          title="Overdue Books"
          value={overdueBooks}
          icon={AlertCircle}
          trend="down"
          trendValue={overdueBooks > 0 ? String(overdueBooks) : undefined}
          trendLabel={overdueBooks > 0 ? "Action needed" : "All returned"}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <button
          type="button"
          onClick={openBorrowModal}
          className="col-span-1 flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg py-6 shadow hover:bg-indigo-800 transition"
        >
          <Repeat className="h-6 w-6 mb-2" />
          <span className="font-semibold">Borrow Book</span>
        </button>
        <button
          type="button"
          onClick={openReturnModal}
          className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition"
        >
          <Repeat className="h-6 w-6 mb-2" />
          <span className="font-semibold">Return Book</span>
        </button>
        <button
          type="button"
          onClick={openAddMemberModal}
          className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition"
        >
          <UserPlus className="h-6 w-6 mb-2" />
          <span className="font-semibold">Add Member</span>
        </button>
        <button
          type="button"
          onClick={openAddBookModal}
          className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition"
        >
          <Plus className="h-6 w-6 mb-2" />
          <span className="font-semibold">Add Book</span>
        </button>

        {isAdmin && (
          <>
            <Link
              to="/genres"
              className="col-span-1 flex flex-col items-center justify-center bg-red-50 border border-red-200 text-red-700 rounded-lg py-6 shadow hover:bg-red-100 transition md:col-span-2"
            >
              <Tag className="h-6 w-6 mb-2" />
              <span className="font-semibold">Manage Genres</span>
            </Link>
            <Link
              to="/reports"
              className="col-span-1 flex flex-col items-center justify-center bg-red-50 border border-red-200 text-red-700 rounded-lg py-6 shadow hover:bg-red-100 transition md:col-span-2"
            >
              <BarChart2 className="h-6 w-6 mb-2" />
              <span className="font-semibold">Admin Reports</span>
            </Link>
          </>
        )}
      </div>

      <Modal
        isOpen={showBorrowModal}
        onClose={closeBorrowModal}
        title="Borrow Book"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book</label>
            <select
              className="w-full border rounded p-2"
              value={borrowForm.bookId}
              onChange={(e) =>
                setBorrowForm((f) => ({ ...f, bookId: e.target.value }))
              }
            >
              <option value="">Select a book</option>
              {safeBooks
                .filter((b) => !b.borrowed)
                .map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Member</label>
            <select
              className="w-full border rounded p-2"
              value={borrowForm.memberId}
              onChange={(e) =>
                setBorrowForm((f) => ({ ...f, memberId: e.target.value }))
              }
            >
              <option value="">Select a member</option>
              {safeMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              value={borrowForm.dueDate}
              onChange={(e) =>
                setBorrowForm((f) => ({ ...f, dueDate: e.target.value }))
              }
            />
          </div>
          {borrowModalError && (
            <div className="text-red-600 text-sm">{borrowModalError}</div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeBorrowModal}>
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={
                !borrowForm.bookId ||
                !borrowForm.memberId ||
                !borrowForm.dueDate
              }
            >
              Borrow
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReturnModal}
        onClose={closeReturnModal}
        title="Return Book"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Borrow Record
            </label>
            <select
              className="w-full border rounded p-2"
              value={returnForm.borrowId}
              onChange={(e) =>
                setReturnForm((f) => ({ ...f, borrowId: e.target.value }))
              }
            >
              <option value="">Select a borrow record</option>
              {safeBorrowRecords
                .filter((r) => !r.returnDate)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.bookTitle ?? "Book"} - {r.memberName ?? "Member"} (Due:{" "}
                    {r.dueDate?.slice(0, 10)})
                  </option>
                ))}
            </select>
          </div>
          {returnModalError && (
            <div className="text-red-600 text-sm">{returnModalError}</div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeReturnModal}>
              Cancel
            </Button>
            <Button onClick={handleReturn} disabled={!returnForm.borrowId}>
              Return
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddMemberModal}
        onClose={closeAddMemberModal}
        title="Add Member"
      >
        <MemberForm
          onSuccess={() => {
            closeAddMemberModal();
            queryClient.invalidateQueries({ queryKey: ["members"] });
          }}
        />
      </Modal>

      <Modal
        isOpen={showAddBookModal}
        onClose={closeAddBookModal}
        title="Add Book"
      >
        <BookForm
          onSuccess={() => {
            closeAddBookModal();
            queryClient.invalidateQueries({ queryKey: ["books"] });
          }}
        />
      </Modal>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
          {borrowLoading ? (
            <div className="flex items-center justify-center px-6 py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-500">
                Loading recent activity...
              </span>
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center px-6 py-4">
                <Repeat
                  className={`h-5 w-5 mr-3 ${
                    activity.type === "borrow"
                      ? "text-indigo-600"
                      : "text-green-600"
                  }`}
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900">
                    {activity.type === "borrow" ? "Borrowed" : "Returned"}:{" "}
                    {activity.book}
                  </span>
                  <div className="text-sm text-gray-500">
                    Member: {activity.member} • {activity.date}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center px-6 py-8 text-gray-500">
              No recent activity found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
