import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from "react";
import "./index.css";
// Layout
import Layout from "./components/layout/Layout";
// Lazy load all pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Books = lazy(() => import("./pages/Books"));
const Members = lazy(() => import("./pages/Members"));
const Staff = lazy(() => import("./pages/Staff"));
const Genres = lazy(() => import("./pages/Genres"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/Signup"));
const BorrowReturn = lazy(() => import("./pages/BorrowReturn"));
const Reports = lazy(() => import("./pages/Reports"));
const Profile = lazy(() => import("./pages/Profile"));
// Loading component
const LoadingSpinner = () =>
  _jsx("div", {
    className: "flex items-center justify-center min-h-screen",
    children: _jsx("div", {
      className:
        "animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600",
    }),
  });
// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
// Main App Component
function App() {
  return _jsxs(QueryClientProvider, {
    client: queryClient,
    children: [
      _jsx(AppContent, {}),
      _jsx(ReactQueryDevtools, { initialIsOpen: false }),
    ],
  });
}
// Separate component to handle routing and layout
function AppContent() {
  return _jsxs("div", {
    className: "min-h-screen bg-gray-50",
    children: [
      _jsx(Toaster, {
        position: "top-right",
        toastOptions: {
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "white",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "white",
            },
          },
        },
      }),
      _jsx(Suspense, {
        fallback: _jsx(LoadingSpinner, {}),
        children: _jsxs(Routes, {
          children: [
            _jsx(Route, { path: "/login", element: _jsx(Login, {}) }),
            _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }),
            _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }),
            _jsxs(Route, {
              path: "/",
              element: _jsx(Layout, {}),
              children: [
                _jsx(Route, { index: true, element: _jsx(Dashboard, {}) }),
                _jsx(Route, { path: "books", element: _jsx(Books, {}) }),
                _jsx(Route, { path: "members/*", element: _jsx(Members, {}) }),
                _jsx(Route, { path: "staff/*", element: _jsx(Staff, {}) }),
                _jsx(Route, { path: "genres", element: _jsx(Genres, {}) }),
                _jsx(Route, {
                  path: "borrow-return",
                  element: _jsx(BorrowReturn, {}),
                }),
                _jsx(Route, { path: "reports", element: _jsx(Reports, {}) }),
              ],
            }),
            _jsx(Route, { path: "*", element: _jsx(NotFound, {}) }),
          ],
        }),
      }),
    ],
  });
}
export default App;
