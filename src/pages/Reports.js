import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, TrendingUp, BarChart3, Clock, CheckCircle, Loader2, } from "lucide-react";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";
const fetchOverdueBooks = async () => {
    const { data } = await api.get("/borrow-records/reports/overdue");
    return data.map((book) => ({
        id: book.id?.toString() ?? "",
        title: typeof book.title === "string" ? book.title : "",
        memberName: typeof book.memberName === "string" ? book.memberName : "",
        dueDate: typeof book.dueDate === "string" ? book.dueDate : "",
        daysOverdue: typeof book.daysOverdue === "number" ? book.daysOverdue : 0,
    }));
};
const fetchPopularGenres = async () => {
    const { data } = await api.get("/borrow-records/reports/popular-genres");
    return data.map((genre) => ({
        name: typeof genre.name === "string" ? genre.name : "",
        borrowCount: typeof genre.borrowCount === "number" ? genre.borrowCount : 0,
        percentage: typeof genre.percentage === "number" ? genre.percentage : 0,
    }));
};
const fetchSummaryStats = async () => {
    const { data } = await api.get("/borrow-records/reports/summary");
    return {
        totalBorrowsThisMonth: typeof data.totalBorrowsThisMonth === "number"
            ? data.totalBorrowsThisMonth
            : 0,
        averageBorrowDuration: typeof data.averageBorrowDuration === "number"
            ? data.averageBorrowDuration
            : 0,
        returnRate: typeof data.returnRate === "number" ? data.returnRate : 0,
    };
};
export default function Reports() {
    const { isAuthenticated, user } = useUserStore();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    const { data: overdueBooks = [], isLoading: overdueLoading, error: overdueError, } = useQuery({
        queryKey: ["overdue-books"],
        queryFn: fetchOverdueBooks,
    });
    const { data: popularGenres = [], isLoading: genresLoading, error: genresError, } = useQuery({
        queryKey: ["popular-genres"],
        queryFn: fetchPopularGenres,
    });
    const { data: summaryStats, isLoading: statsLoading, error: statsError, } = useQuery({
        queryKey: ["summary-stats"],
        queryFn: fetchSummaryStats,
    });
    const isLoading = overdueLoading || genresLoading || statsLoading;
    const error = overdueError || genresError || statsError;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-indigo-600" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "Failed to load reports. Please try again later." }) })] }) }));
    }
    return (_jsxs("div", { className: "px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-extrabold text-gray-900", children: "Reports" }), _jsx("p", { className: "text-gray-500 text-lg mt-1", children: "Library analytics and reports" })] }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-2 mb-8", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(AlertTriangle, { className: "h-6 w-6 text-red-500" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Overdue Books" })] }), _jsx("p", { className: "text-gray-600 mb-6", children: "Books that are past their due date" }), _jsxs("div", { className: "space-y-4", children: [overdueBooks.slice(0, 5).map((book) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: book.title }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Member: ", book.memberName] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Due: ", new Date(book.dueDate).toLocaleDateString()] })] }), _jsxs("span", { className: "bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold", children: [book.daysOverdue, " days overdue"] })] }, book.id))), overdueBooks.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No overdue books found" }))] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(TrendingUp, { className: "h-6 w-6 text-green-500" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Popular Genres" })] }), _jsx("p", { className: "text-gray-600 mb-6", children: "Most borrowed book genres" }), _jsxs("div", { className: "space-y-4", children: [popularGenres.slice(0, 5).map((genre, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-lg font-bold text-gray-400", children: ["#", index + 1] }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: genre.name }), _jsxs("div", { className: "text-sm text-gray-600", children: [genre.borrowCount, " borrows"] })] })] }), _jsx("div", { className: "w-24 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${genre.percentage}%` } }) })] }, genre.name))), popularGenres.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No genre data available" }))] })] })] }), _jsxs("div", { className: "grid gap-8 sm:grid-cols-1 md:grid-cols-3", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow p-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx(BarChart3, { className: "h-8 w-8 text-indigo-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Total Borrows This Month" }), _jsx("div", { className: "text-4xl font-bold text-indigo-600", children: summaryStats?.totalBorrowsThisMonth || 0 })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow p-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx(Clock, { className: "h-8 w-8 text-green-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Average Borrow Duration" }), _jsxs("div", { className: "text-4xl font-bold text-green-600", children: [summaryStats?.averageBorrowDuration || 0, " days"] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow p-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx(CheckCircle, { className: "h-8 w-8 text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Return Rate" }), _jsxs("div", { className: "text-4xl font-bold text-blue-600", children: [summaryStats?.returnRate || 0, "%"] })] })] })] }));
}
