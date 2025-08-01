import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUserStore } from "@/store/userStore";
import { Shield, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
export default function Profile() {
    const { user } = useUserStore();
    const permissions = user?.role === "admin"
        ? [
            "Full system administration access",
            "Manage all books, members, and genres",
            "Delete records and manage staff",
            "Access all reports and analytics",
        ]
        : user?.role === "librarian"
            ? [
                "Manage books, members, and genres",
                "Handle borrowing and returns",
                "View reports",
            ]
            : ["View books and genres", "Borrow and return books"];
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-4", children: "Profile" }), _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center", children: _jsx(Shield, { className: "h-8 w-8 text-indigo-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: user?.name || "User" }), _jsx("span", { className: "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200", children: user?.role?.toUpperCase() || "ADMIN" })] })] }), _jsxs("div", { className: "space-y-4 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "h-5 w-5 text-gray-400" }), _jsx("span", { className: "text-gray-700", children: user?.email || "No email" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "h-5 w-5 text-gray-400" }), _jsx("span", { className: "text-gray-700", children: user?.phone || "No phone" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Calendar, { className: "h-5 w-5 text-gray-400" }), _jsxs("span", { className: "text-gray-700", children: ["Member Since:", " ", user?.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N/A"] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow  p-6 mt-8", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "Permissions & Access" }), _jsx("p", { className: "text-gray-500 mb-4 text-sm", children: "Your current role permissions" }), _jsx("ul", { className: "space-y-2", children: permissions.map((perm, idx) => (_jsxs("li", { className: "flex items-center text-green-700 font-medium", children: [_jsx(ShieldCheck, { className: "h-5 w-5 text-green-500 mr-2" }), perm] }, idx))) })] })] }) }));
}
