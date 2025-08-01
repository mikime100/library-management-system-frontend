import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMembers } from "@/lib/api";
import MemberCard from "../components/members/MemberCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import MemberForm from "../components/members/MemberForm";
import Modal from "../components/ui/Modal";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";
export default function Members() {
    const { isAuthenticated } = useUserStore();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const { data: members = [], isLoading, error, refetch, } = useQuery({
        queryKey: ["members"],
        queryFn: fetchMembers,
    });
    const filteredMembers = members.filter((member) => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.membershipNumber.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    return (_jsxs("div", { className: "px-8 py-8", children: [_jsx(Modal, { isOpen: showAddModal, onClose: () => setShowAddModal(false), title: "Add New Member", widthClass: "max-w-xl", children: _jsx(MemberForm, { onSuccess: () => {
                        setShowAddModal(false);
                        refetch();
                    } }) }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-extrabold text-gray-900", children: "Members" }), _jsx("p", { className: "text-gray-500 text-lg mt-1", children: "Manage library members" })] }), _jsx(Button, { onClick: () => setShowAddModal(true), className: "bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900", children: "+ Add Member" })] }), _jsx("div", { className: "mb-8", children: _jsx(Input, { type: "text", placeholder: "Search members by name", className: "w-full max-w-xl px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-indigo-600" }) })) : error ? (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "Failed to load members. Please try again later." }) })] }) })) : filteredMembers.length > 0 ? (_jsx("div", { className: "grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: filteredMembers.map((member) => (_jsx(MemberCard, { member: member, onChange: refetch }, member.id))) })) : (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100", children: _jsx(UserPlus, { className: "h-6 w-6 text-gray-400" }) }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No members found" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: searchTerm
                            ? "Try adjusting your search criteria."
                            : "Get started by adding a new member." }), _jsx("div", { className: "mt-6", children: _jsxs(Button, { as: Link, to: "/members/new", variant: "outline", children: [_jsx(Plus, { className: "-ml-1 mr-2 h-4 w-4" }), "Add Member"] }) })] }))] }));
}
