import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User, Mail, Phone, Clock, CheckCircle2, XCircle, Eye, Pencil, Trash, } from "lucide-react";
import MemberForm from "./MemberForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "@/lib/api";
import { useState } from "react";
export default function MemberCard({ member, onChange }) {
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const statusColors = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        suspended: "bg-red-100 text-red-800",
    };
    const statusIcons = {
        active: _jsx(CheckCircle2, { className: "h-3.5 w-3.5 mr-1" }),
        inactive: _jsx(Clock, { className: "h-3.5 w-3.5 mr-1" }),
        suspended: _jsx(XCircle, { className: "h-3.5 w-3.5 mr-1" }),
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow p-8 flex flex-col gap-6 relative hover:shadow-xl transition-shadow duration-200 min-h-[270px]", children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[member.status]}`, children: member.status === "active"
                        ? `${member.borrowedBooks} active`
                        : member.status.charAt(0).toUpperCase() + member.status.slice(1) }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: member.image ? (_jsx("img", { className: "h-12 w-12 rounded-full", src: member.image, alt: member.name })) : (_jsx("div", { className: "h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center", children: _jsx(User, { className: "h-6 w-6 text-indigo-600" }) })) }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-gray-900", children: member.name }), _jsx("div", { className: "text-sm text-gray-500", children: member.email })] })] }), _jsxs("div", { className: "flex flex-col gap-1 text-sm text-gray-600 mt-2", children: [member.phone && _jsxs("div", { children: ["Phone: ", member.phone] }), _jsxs("div", { children: ["Joined: ", new Date(member.joinDate).toLocaleDateString()] }), _jsxs("div", { children: ["Active Borrows: ", member.borrowedBooks] })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("button", { type: "button", className: "inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400", title: "View", onClick: () => setShowViewModal(true), children: _jsx(Eye, { className: "h-5 w-5" }) }), _jsx("button", { type: "button", className: "inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400", title: "Edit", onClick: () => setShowEditModal(true), children: _jsx(Pencil, { className: "h-5 w-5" }) }), _jsx("button", { type: "button", className: "inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 text-red-600 focus:ring-2 focus:ring-red-400", title: "Delete", onClick: () => setShowDeleteModal(true), children: _jsx(Trash, { className: "h-5 w-5" }) })] }), _jsxs(Modal, { isOpen: showViewModal, onClose: () => setShowViewModal(false), title: member.name, widthClass: "max-w-md", children: [_jsx("div", { className: "mb-1 text-gray-600", children: "Member Details" }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Mail, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { children: member.email })] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Phone, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { children: member.phone })] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-500" }), _jsxs("span", { children: ["Joined:", " ", member.joinDate
                                        ? new Date(member.joinDate).toLocaleDateString()
                                        : "N/A"] })] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-500" }), _jsxs("span", { children: ["Active Borrows: ", member.borrowedBooks] })] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx("span", { children: "Status: " }), _jsxs("span", { className: `inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[member.status]}`, children: [statusIcons[member.status], member.status.charAt(0).toUpperCase() + member.status.slice(1)] })] })] }), _jsxs(Modal, { isOpen: showEditModal, onClose: () => setShowEditModal(false), title: "Edit Member", widthClass: "max-w-md", children: [successMsg && (_jsx("div", { className: "mb-2 p-2 rounded bg-green-100 text-green-800 text-center text-sm font-medium", children: successMsg })), _jsx("div", { className: "mb-3 text-gray-600", children: "Update the member information below." }), _jsx(MemberForm, { defaultValues: member, isEditing: true, onSuccess: () => {
                            setShowEditModal(false);
                            setSuccessMsg("Member updated successfully!");
                            setTimeout(() => setSuccessMsg(""), 2500);
                            if (onChange)
                                onChange();
                        } })] }), _jsxs(Modal, { isOpen: showDeleteModal, onClose: () => setShowDeleteModal(false), title: "Delete Member", widthClass: "max-w-md", children: [successMsg && (_jsx("div", { className: "mb-2 p-2 rounded bg-green-100 text-green-800 text-center text-sm font-medium", children: successMsg })), _jsxs("div", { className: "mb-4", children: ["Are you sure you want to delete \"", member.name, "\"? This action cannot be undone."] }), deleteError && _jsx("div", { className: "text-red-600 mb-2", children: deleteError }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowDeleteModal(false), disabled: deleteLoading, children: "Cancel" }), _jsx(Button, { className: "bg-red-600 text-white", onClick: async () => {
                                    setDeleteLoading(true);
                                    setDeleteError("");
                                    try {
                                        await api.delete(`/members/${member.id}`);
                                        setShowDeleteModal(false);
                                        setSuccessMsg("Member deleted successfully!");
                                        setTimeout(() => setSuccessMsg(""), 2500);
                                        if (onChange)
                                            onChange();
                                    }
                                    catch (err) {
                                        const rawMsg = err?.response?.data?.message ||
                                            err?.message ||
                                            "Failed to delete member.";
                                        if (rawMsg.includes("FOREIGN KEY constraint failed")) {
                                            setDeleteError("This member cannot be deleted because they have borrowing records. Please remove or reassign those records first.");
                                        }
                                        else {
                                            setDeleteError(rawMsg);
                                        }
                                    }
                                    finally {
                                        setDeleteLoading(false);
                                    }
                                }, disabled: deleteLoading, children: "Delete" })] })] })] }));
}
