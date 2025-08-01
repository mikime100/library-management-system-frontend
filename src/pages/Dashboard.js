import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Users, AlertCircle, Shield, Plus, Repeat, BarChart2, UserPlus, Tag, } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
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
    if (data && Array.isArray(data.books))
        return data.books;
    if (Array.isArray(data))
        return data;
    return [];
};
const fetchGenres = async () => {
    const { data } = await api.get("/genres");
    if (data && Array.isArray(data.genres))
        return data.genres;
    if (Array.isArray(data))
        return data;
    return [];
};
export default function Dashboard() {
    const { isAuthenticated, user } = useUserStore();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    const { data: books = [], isLoading: booksLoading, error: booksError, } = useQuery({
        queryKey: ["books"],
        queryFn: fetchBooks,
    });
    const { data: members = [], isLoading: membersLoading, error: membersError, } = useQuery({
        queryKey: ["members"],
        queryFn: fetchMembers,
    });
    const { data: genres = [], isLoading: genresLoading, error: genresError, } = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
    });
    const { borrowRecords, overdueBorrows, loading: borrowLoading, error: borrowError, fetchBorrowRecords, borrowBook, returnBook, } = useBorrowReturnStore();
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
            const selectedMember = safeMembers.find((m) => m.id === borrowForm.memberId);
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
        }
        catch (err) {
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
        }
        catch (err) {
            setReturnModalError(err?.message || "Failed to return book");
        }
    };
    useEffect(() => {
        fetchBorrowRecords();
    }, []);
    const isLoading = booksLoading || membersLoading || genresLoading || borrowLoading;
    const error = booksError || membersError || genresError || borrowError;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) }));
    }
    if (error) {
        console.error("Error fetching dashboard data:", error);
        return (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsxs("p", { className: "text-sm text-red-700", children: ["Failed to load dashboard data. Please try again later.", _jsx("br", {}), _jsx("span", { style: { fontSize: "0.8em", color: "#555" }, children: String(error) })] }) })] }) }));
    }
    const safeBooks = Array.isArray(books) ? books : [];
    const safeMembers = Array.isArray(members) ? members : [];
    const safeBorrowRecords = Array.isArray(borrowRecords) ? borrowRecords : [];
    const safeOverdueBorrows = Array.isArray(overdueBorrows)
        ? overdueBorrows
        : [];
    const totalBooks = safeBooks.length;
    const totalMembers = safeMembers.length;
    const totalBorrowed = safeBorrowRecords.filter((r) => r && !r.returnDate).length;
    const overdueBooks = safeOverdueBorrows.length;
    const totalReturned = safeBorrowRecords.filter((r) => r && r.returnDate).length;
    const totalBorrows = safeBorrowRecords.length;
    const returnRate = totalBorrows > 0 ? Math.round((totalReturned / totalBorrows) * 100) : 0;
    const genreCount = safeBooks.reduce((acc, book) => {
        if (Array.isArray(book.genre)) {
            book.genre.forEach((g) => {
                acc[g] = (acc[g] || 0) + 1;
            });
        }
        else if (book.genre) {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
        }
        return acc;
    }, {});
    const popularGenres = Object.entries(genreCount)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    if (totalBooks === 0 &&
        totalMembers === 0 &&
        totalBorrowed === 0 &&
        overdueBooks === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-gray-500", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "No dashboard data available" }), _jsx("p", { children: "Please add books, members, or borrow records to see statistics." })] }));
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
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h1", { className: "text-3xl font-extrabold text-gray-900", children: isAdmin
                                            ? "Admin Dashboard"
                                            : isLibrarian
                                                ? "Librarian Dashboard"
                                                : "Dashboard" }), _jsxs("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isAdmin
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : "bg-black text-white border border-gray-300"}`, children: [isAdmin ? (_jsx(Shield, { className: "h-4 w-4 mr-1" })) : (_jsx(UserPlus, { className: "h-4 w-4 mr-1" })), " ", role.toUpperCase()] })] }), _jsx("p", { className: "text-gray-500 text-base", children: isAdmin
                                    ? "Full system access - Manage all library operations"
                                    : isLibrarian
                                        ? "Standard library operations - Books, members, and borrowing"
                                        : "Overview of your library's performance and statistics." })] }), _jsx("div", { className: "flex items-center space-x-3", children: _jsxs("span", { className: "text-gray-700 font-medium", children: ["Welcome, ", user?.name || "admin"] }) })] }), isAdmin ? (_jsxs("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center gap-4", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-red-700", children: "Administrator Access" }), _jsx("p", { className: "text-red-600 text-sm", children: "You have full system privileges including delete operations, genre management, and staff administration." })] })] })) : isLibrarian ? (_jsxs("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-center gap-4", children: [_jsx(UserPlus, { className: "h-6 w-6 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-green-700", children: "Librarian Access" }), _jsx("p", { className: "text-green-700 text-sm", children: "You can manage books and members, handle borrowing operations, and view reports. Contact admin for advanced operations." })] })] })) : null, _jsxs("div", { className: "grid gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx(StatCard, { title: "Total Books", value: totalBooks, icon: BookOpen, trend: "up", trendValue: "12%", trendLabel: "All books in system" }), _jsx(StatCard, { title: "Total Members", value: totalMembers, icon: Users, trend: "up", trendValue: "5%", trendLabel: "All members in system" }), _jsx(StatCard, { title: "Active Borrows", value: totalBorrowed, icon: Repeat, trend: "neutral", trendLabel: "Currently borrowed" }), _jsx(StatCard, { title: "Overdue Books", value: overdueBooks, icon: AlertCircle, trend: "down", trendValue: overdueBooks > 0 ? String(overdueBooks) : undefined, trendLabel: overdueBooks > 0 ? "Action needed" : "All returned" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-2", children: [_jsxs("button", { type: "button", onClick: openBorrowModal, className: "col-span-1 flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg py-6 shadow hover:bg-indigo-800 transition", children: [_jsx(Repeat, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Borrow Book" })] }), _jsxs("button", { type: "button", onClick: openReturnModal, className: "col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition", children: [_jsx(Repeat, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Return Book" })] }), _jsxs("button", { type: "button", onClick: openAddMemberModal, className: "col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition", children: [_jsx(UserPlus, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Add Member" })] }), _jsxs("button", { type: "button", onClick: openAddBookModal, className: "col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-900 rounded-lg py-6 shadow hover:bg-indigo-50 transition", children: [_jsx(Plus, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Add Book" })] }), isAdmin && (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/genres", className: "col-span-1 flex flex-col items-center justify-center bg-red-50 border border-red-200 text-red-700 rounded-lg py-6 shadow hover:bg-red-100 transition md:col-span-2", children: [_jsx(Tag, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Manage Genres" })] }), _jsxs(Link, { to: "/reports", className: "col-span-1 flex flex-col items-center justify-center bg-red-50 border border-red-200 text-red-700 rounded-lg py-6 shadow hover:bg-red-100 transition md:col-span-2", children: [_jsx(BarChart2, { className: "h-6 w-6 mb-2" }), _jsx("span", { className: "font-semibold", children: "Admin Reports" })] })] }))] }), _jsx(Modal, { isOpen: showBorrowModal, onClose: closeBorrowModal, title: "Borrow Book", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Book" }), _jsxs("select", { className: "w-full border rounded p-2", value: borrowForm.bookId, onChange: (e) => setBorrowForm((f) => ({ ...f, bookId: e.target.value })), children: [_jsx("option", { value: "", children: "Select a book" }), safeBooks
                                            .filter((b) => !b.borrowed)
                                            .map((book) => (_jsx("option", { value: book.id, children: book.title }, book.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Member" }), _jsxs("select", { className: "w-full border rounded p-2", value: borrowForm.memberId, onChange: (e) => setBorrowForm((f) => ({ ...f, memberId: e.target.value })), children: [_jsx("option", { value: "", children: "Select a member" }), safeMembers.map((member) => (_jsx("option", { value: member.id, children: member.name }, member.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Due Date" }), _jsx(Input, { type: "date", value: borrowForm.dueDate, onChange: (e) => setBorrowForm((f) => ({ ...f, dueDate: e.target.value })) })] }), borrowModalError && (_jsx("div", { className: "text-red-600 text-sm", children: borrowModalError })), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: closeBorrowModal, children: "Cancel" }), _jsx(Button, { onClick: handleBorrow, disabled: !borrowForm.bookId ||
                                        !borrowForm.memberId ||
                                        !borrowForm.dueDate, children: "Borrow" })] })] }) }), _jsx(Modal, { isOpen: showReturnModal, onClose: closeReturnModal, title: "Return Book", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Borrow Record" }), _jsxs("select", { className: "w-full border rounded p-2", value: returnForm.borrowId, onChange: (e) => setReturnForm((f) => ({ ...f, borrowId: e.target.value })), children: [_jsx("option", { value: "", children: "Select a borrow record" }), safeBorrowRecords
                                            .filter((r) => !r.returnDate)
                                            .map((r) => (_jsxs("option", { value: r.id, children: [r.bookTitle ?? "Book", " - ", r.memberName ?? "Member", " (Due:", " ", r.dueDate?.slice(0, 10), ")"] }, r.id)))] })] }), returnModalError && (_jsx("div", { className: "text-red-600 text-sm", children: returnModalError })), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: closeReturnModal, children: "Cancel" }), _jsx(Button, { onClick: handleReturn, disabled: !returnForm.borrowId, children: "Return" })] })] }) }), _jsx(Modal, { isOpen: showAddMemberModal, onClose: closeAddMemberModal, title: "Add Member", children: _jsx(MemberForm, { onSuccess: () => {
                        closeAddMemberModal();
                        queryClient.invalidateQueries({ queryKey: ["members"] });
                    } }) }), _jsx(Modal, { isOpen: showAddBookModal, onClose: closeAddBookModal, title: "Add Book", children: _jsx(BookForm, { onSuccess: () => {
                        closeAddBookModal();
                        queryClient.invalidateQueries({ queryKey: ["books"] });
                    } }) }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-4", children: "Recent Activity" }), _jsx("div", { className: "bg-white rounded-lg shadow divide-y divide-gray-100", children: borrowLoading ? (_jsxs("div", { className: "flex items-center justify-center px-6 py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" }), _jsx("span", { className: "ml-2 text-gray-500", children: "Loading recent activity..." })] })) : recentActivity.length > 0 ? (recentActivity.map((activity, idx) => (_jsxs("div", { className: "flex items-center px-6 py-4", children: [_jsx(Repeat, { className: `h-5 w-5 mr-3 ${activity.type === "borrow"
                                        ? "text-indigo-600"
                                        : "text-green-600"}` }), _jsxs("div", { className: "flex-1", children: [_jsxs("span", { className: "font-semibold text-gray-900", children: [activity.type === "borrow" ? "Borrowed" : "Returned", ":", " ", activity.book] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Member: ", activity.member, " \u2022 ", activity.date] })] })] }, idx)))) : (_jsx("div", { className: "flex items-center justify-center px-6 py-8 text-gray-500", children: "No recent activity found" })) })] })] }));
}
