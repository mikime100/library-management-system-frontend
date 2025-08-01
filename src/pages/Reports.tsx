import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

interface OverdueBook {
  id: string;
  title: string;
  memberName: string;
  dueDate: string;
  daysOverdue: number;
}

interface PopularGenre {
  name: string;
  borrowCount: number;
  percentage: number;
}

interface SummaryStats {
  totalBorrowsThisMonth: number;
  averageBorrowDuration: number;
  returnRate: number;
}

const fetchOverdueBooks = async (): Promise<OverdueBook[]> => {
  const { data } = await api.get("/borrow-records/reports/overdue");
  return data.map((book: any) => ({
    id: book.id?.toString() ?? "",
    title: typeof book.title === "string" ? book.title : "",
    memberName: typeof book.memberName === "string" ? book.memberName : "",
    dueDate: typeof book.dueDate === "string" ? book.dueDate : "",
    daysOverdue: typeof book.daysOverdue === "number" ? book.daysOverdue : 0,
  }));
};

const fetchPopularGenres = async (): Promise<PopularGenre[]> => {
  const { data } = await api.get("/borrow-records/reports/popular-genres");
  return data.map((genre: any) => ({
    name: typeof genre.name === "string" ? genre.name : "",
    borrowCount: typeof genre.borrowCount === "number" ? genre.borrowCount : 0,
    percentage: typeof genre.percentage === "number" ? genre.percentage : 0,
  }));
};

const fetchSummaryStats = async (): Promise<SummaryStats> => {
  const { data } = await api.get("/borrow-records/reports/summary");
  return {
    totalBorrowsThisMonth:
      typeof data.totalBorrowsThisMonth === "number"
        ? data.totalBorrowsThisMonth
        : 0,
    averageBorrowDuration:
      typeof data.averageBorrowDuration === "number"
        ? data.averageBorrowDuration
        : 0,
    returnRate: typeof data.returnRate === "number" ? data.returnRate : 0,
  };
};

export default function Reports() {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const {
    data: overdueBooks = [],
    isLoading: overdueLoading,
    error: overdueError,
  } = useQuery<OverdueBook[]>({
    queryKey: ["overdue-books"],
    queryFn: fetchOverdueBooks,
  });

  const {
    data: popularGenres = [],
    isLoading: genresLoading,
    error: genresError,
  } = useQuery<PopularGenre[]>({
    queryKey: ["popular-genres"],
    queryFn: fetchPopularGenres,
  });

  const {
    data: summaryStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<SummaryStats>({
    queryKey: ["summary-stats"],
    queryFn: fetchSummaryStats,
  });

  const isLoading = overdueLoading || genresLoading || statsLoading;
  const error = overdueError || genresError || statsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
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
              Failed to load reports. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-lg mt-1">
          Library analytics and reports
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Overdue Books</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Books that are past their due date
          </p>
          <div className="space-y-4">
            {overdueBooks.slice(0, 5).map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {book.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Member: {book.memberName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                  {book.daysOverdue} days overdue
                </span>
              </div>
            ))}
            {overdueBooks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No overdue books found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Genres</h2>
          </div>
          <p className="text-gray-600 mb-6">Most borrowed book genres</p>
          <div className="space-y-4">
            {popularGenres.slice(0, 5).map((genre, index) => (
              <div
                key={genre.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {genre.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {genre.borrowCount} borrows
                    </div>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${genre.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {popularGenres.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No genre data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Borrows This Month
          </h3>
          <div className="text-4xl font-bold text-indigo-600">
            {summaryStats?.totalBorrowsThisMonth || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Average Borrow Duration
          </h3>
          <div className="text-4xl font-bold text-green-600">
            {summaryStats?.averageBorrowDuration || 0} days
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Return Rate
          </h3>
          <div className="text-4xl font-bold text-blue-600">
            {summaryStats?.returnRate || 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
