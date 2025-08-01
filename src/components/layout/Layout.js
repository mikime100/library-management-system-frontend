import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { Home, BookOpen, Users, UserCog, Tag, Menu, X, LogOut, User, ChevronDown, BarChart2, Repeat, } from "lucide-react";
const getNavigationForRole = (role) => {
    if (role === "admin") {
        return [
            { name: "Dashboard", href: "/", icon: Home },
            { name: "Books", href: "/books", icon: BookOpen },
            { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
            { name: "Members", href: "/members", icon: Users },
            { name: "Staff", href: "/staff", icon: UserCog },
            { name: "Reports", href: "/reports", icon: BarChart2 },
            { name: "Genres", href: "/genres", icon: Tag },
        ];
    }
    else if (role === "librarian") {
        return [
            { name: "Dashboard", href: "/", icon: Home },
            { name: "Books", href: "/books", icon: BookOpen },
            { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
        ];
    }
    return [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Books", href: "/books", icon: BookOpen },
        { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
    ];
};
export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const { user, logout } = useUserStore();
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const navigation = getNavigationForRole(user?.role || "");
    return (_jsxs("div", { className: "h-screen flex overflow-hidden bg-gray-100", children: [_jsxs("div", { className: `${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden fixed inset-0 flex z-40 transition-transform duration-300 ease-in-out`, children: [_jsx("div", { className: "fixed inset-0", children: _jsx("div", { className: "absolute inset-0 bg-gray-600 opacity-75", onClick: () => setSidebarOpen(false) }) }), _jsxs("div", { className: "relative flex-1 flex flex-col max-w-xs w-full bg-white", children: [_jsxs("div", { className: "flex-1 h-0 pt-5 pb-4 overflow-y-auto", children: [_jsx("div", { className: "flex-shrink-0 flex items-center px-4", children: _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "LibraryMS" }) }), _jsx("nav", { className: "mt-5 px-2 space-y-1", children: navigation.map((item) => {
                                            const isActive = location.pathname === item.href;
                                            return (_jsxs(Link, { to: item.href, className: `${isActive
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"} group flex items-center px-2 py-2 text-base font-medium rounded-md`, onClick: () => setSidebarOpen(false), children: [_jsx(item.icon, { className: `${isActive
                                                            ? "text-gray-500"
                                                            : "text-gray-400 group-hover:text-gray-500"} mr-4 h-6 w-6`, "aria-hidden": "true" }), item.name] }, item.name));
                                        }) })] }), _jsx("div", { className: "flex-shrink-0 flex border-t border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center", children: _jsx(User, { className: "h-6 w-6 text-indigo-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: user?.name }), _jsx("p", { className: "text-xs font-medium text-gray-500", children: user?.role })] })] }) })] }), _jsx("div", { className: "flex-shrink-0 w-14", children: _jsx("button", { className: "h-12 w-12 flex items-center justify-center", onClick: () => setSidebarOpen(false), children: _jsx(X, { className: "h-6 w-6 text-white" }) }) })] }), _jsx("div", { className: "hidden md:flex md:flex-shrink-0", children: _jsx("div", { className: "flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm", children: _jsxs("div", { className: "flex flex-col h-0 flex-1", children: [_jsx("div", { className: "flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-100", children: _jsx("h1", { className: "text-2xl font-extrabold tracking-tight text-indigo-700", children: "Library Manager" }) }), _jsx("nav", { className: "flex-1 px-2 py-4 space-y-1", children: navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (_jsxs(Link, { to: item.href, className: `group flex items-center px-4 py-3 text-base font-semibold rounded-lg transition-colors duration-150 ${isActive
                                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"}`, children: [_jsx(item.icon, { className: `mr-4 h-6 w-6 ${isActive
                                                    ? "text-indigo-600"
                                                    : "text-gray-400 group-hover:text-indigo-600"}`, "aria-hidden": "true" }), item.name] }, item.name));
                                }) }), _jsxs("div", { className: "flex-shrink-0 flex flex-col items-center border-t border-gray-100 p-6", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2", children: _jsx(User, { className: "h-7 w-7 text-indigo-600" }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-base font-semibold text-gray-900", children: user?.name || "admin" }), _jsx("span", { className: `inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${user?.role === "admin"
                                                    ? "bg-red-100 text-red-700 border border-red-200"
                                                    : "bg-gray-200 text-gray-700 border border-gray-300"}`, children: user?.role ? user.role.toUpperCase() : "ADMIN" })] })] })] }) }) }), _jsxs("div", { className: "flex flex-col w-0 flex-1 overflow-hidden", children: [_jsxs("div", { className: "relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-100", children: [_jsxs("button", { className: "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden", onClick: () => setSidebarOpen(true), children: [_jsx("span", { className: "sr-only", children: "Open sidebar" }), _jsx(Menu, { className: "h-6 w-6", "aria-hidden": "true" })] }), _jsxs("div", { className: "flex-1 px-6 flex items-center justify-between", children: [_jsx("div", {}), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "text-gray-700 font-medium", children: ["Welcome, ", user?.name || "admin"] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", className: "max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", id: "user-menu", onClick: () => setUserDropdownOpen(!userDropdownOpen), children: [_jsx("span", { className: "sr-only", children: "Open user menu" }), _jsx("div", { className: "h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center", children: _jsx(User, { className: "h-5 w-5 text-indigo-600" }) }), _jsx(ChevronDown, { className: "ml-1 h-4 w-4 text-gray-500" })] }), userDropdownOpen && (_jsxs("div", { className: "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", role: "menu", "aria-orientation": "vertical", "aria-labelledby": "user-menu", children: [_jsx(Link, { to: "/profile", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", role: "menuitem", onClick: () => setUserDropdownOpen(false), children: "Your Profile" }), _jsxs("button", { onClick: () => {
                                                                    handleLogout();
                                                                    setUserDropdownOpen(false);
                                                                }, className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center", role: "menuitem", children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Sign out"] })] }))] })] })] })] }), _jsx("main", { className: "flex-1 relative overflow-y-auto focus:outline-none bg-gray-50", children: _jsx("div", { className: "py-6\n          ", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-8", children: children ? children : _jsx(Outlet, {}) }) }) })] })] }));
}
