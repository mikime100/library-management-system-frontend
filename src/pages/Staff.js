import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, UserCog, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import StaffCard from ".././components/staff/StaffCard";
import Button from ".././components/ui/Button";
import Input from ".././components/ui/Input";
import StaffForm from "../components/staff/StaffForm";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
const fetchStaff = async () => {
  try {
    console.log("Fetching staff from /auth/users...");
    let data;
    try {
      const response = await api.get("/auth/users");
      data = response.data;
      console.log("Staff data received from /auth/users:", data);
    } catch (firstError) {
      console.log("First attempt failed, trying /staff...");
      try {
        const response = await api.get("/staff");
        data = response.data;
        console.log("Staff data received from /staff:", data);
      } catch (secondError) {
        console.log("Second attempt failed, trying /users...");
        const response = await api.get("/users");
        data = response.data;
        console.log("Staff data received from /users:", data);
      }
    }
    console.log("Raw data type:", typeof data);
    console.log("Raw data:", data);
    let staffArray = [];
    if (Array.isArray(data)) {
      staffArray = data;
    } else if (data && typeof data === "object") {
      if (Array.isArray(data.users)) {
        staffArray = data.users;
      } else if (Array.isArray(data.staff)) {
        staffArray = data.staff;
      } else if (Array.isArray(data.members)) {
        staffArray = data.members;
      } else {
        staffArray = [data];
      }
    } else {
      console.log("Data is not an array or object, returning empty array");
      staffArray = [];
    }
    console.log("Processed staff array:", staffArray);
    return staffArray.map((s) => ({
      id: s.id?.toString() ?? "",
      name:
        typeof s.name === "string" && s.name
          ? s.name
          : typeof s.username === "string" && s.username
          ? s.username
          : typeof s.email === "string"
          ? s.email
          : "",
      email: typeof s.email === "string" ? s.email : "",
      phone: typeof s.phone === "string" ? s.phone : "",
      role: s.role === "admin" || s.role === "librarian" ? s.role : "librarian",
      joinDate:
        typeof s.join_date === "string" && s.join_date
          ? s.join_date
          : typeof s.created_at === "string" && s.created_at
          ? s.created_at
          : "",
      status:
        s.status === "active" || s.status === "inactive" ? s.status : "active",
      lastLogin: typeof s.lastLogin === "string" ? s.lastLogin : undefined,
      image: typeof s.image === "string" ? s.image : undefined,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";
export default function Staff() {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return _jsx(Navigate, { to: "/login", replace: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modal, setModal] = useState({ type: null });
  const {
    data: staffMembers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const handleDelete = async () => {
    if (!modal.staff) return;
    try {
      await api.delete(`/staff/${modal.staff.id}`);
      setModal({ type: null });
      toast.error(`Staff member "${modal.staff.name}" deleted successfully!`);
      refetch();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete staff member.";
      toast.error(errorMessage);
    }
  };
  return _jsxs("div", {
    className: "px-8 py-8",
    children: [
      _jsx(Modal, {
        isOpen: showAddModal,
        onClose: () => setShowAddModal(false),
        title: "Add New Staff",
        widthClass: "max-w-xl",
        children: _jsx(StaffForm, {
          onSuccess: () => {
            setShowAddModal(false);
            refetch();
          },
        }),
      }),
      _jsx(Modal, {
        isOpen: modal.type === "view",
        onClose: () => setModal({ type: null }),
        title: "Staff Details",
        widthClass: "max-w-md",
        children:
          modal.staff &&
          _jsxs("div", {
            className: "space-y-4",
            children: [
              _jsxs("div", {
                className: "flex items-center gap-4",
                children: [
                  modal.staff.image
                    ? _jsx("img", {
                        className: "h-16 w-16 rounded-full",
                        src: modal.staff.image,
                        alt: modal.staff.name,
                      })
                    : _jsx("div", {
                        className:
                          "h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center",
                        children:
                          modal.staff.role === "admin"
                            ? _jsx(Shield, {
                                className: "h-8 w-8 text-indigo-600",
                              })
                            : _jsx(User, {
                                className: "h-8 w-8 text-indigo-600",
                              }),
                      }),
                  _jsxs("div", {
                    children: [
                      _jsx("div", {
                        className: "text-xl font-bold text-gray-900",
                        children: modal.staff.name,
                      }),
                      _jsx("div", {
                        className: "text-sm text-gray-500",
                        children: modal.staff.email,
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "text-sm text-gray-600",
                children: [
                  _jsxs("div", {
                    children: ["Phone: ", modal.staff.phone || "-"],
                  }),
                  _jsxs("div", {
                    children: [
                      "Role:",
                      " ",
                      modal.staff.role.charAt(0).toUpperCase() +
                        modal.staff.role.slice(1),
                    ],
                  }),
                  _jsxs("div", {
                    children: [
                      "Status:",
                      " ",
                      modal.staff.status.charAt(0).toUpperCase() +
                        modal.staff.status.slice(1),
                    ],
                  }),
                  _jsxs("div", {
                    children: [
                      "Created:",
                      " ",
                      modal.staff.joinDate
                        ? new Date(modal.staff.joinDate).toLocaleDateString()
                        : "-",
                    ],
                  }),
                ],
              }),
            ],
          }),
      }),
      _jsx(Modal, {
        isOpen: modal.type === "edit",
        onClose: () => setModal({ type: null }),
        title: "Edit Staff",
        widthClass: "max-w-xl",
        children:
          modal.staff &&
          _jsx(StaffForm, {
            defaultValues: {
              id: modal.staff.id,
              username: modal.staff.name,
              email: modal.staff.email,
              role: modal.staff.role,
            },
            isEditing: true,
            onSuccess: () => {
              setModal({ type: null });
              refetch();
            },
          }),
      }),
      _jsx(Modal, {
        isOpen: modal.type === "delete",
        onClose: () => setModal({ type: null }),
        title: "Delete Staff Member",
        widthClass: "max-w-sm",
        children: _jsxs("div", {
          className: "space-y-4",
          children: [
            _jsxs("p", {
              children: [
                "Are you sure you want to delete",
                " ",
                _jsx("span", {
                  className: "font-bold",
                  children: modal.staff?.name,
                }),
                "?",
              ],
            }),
            _jsxs("div", {
              className: "flex justify-end gap-4",
              children: [
                _jsx(Button, {
                  onClick: () => setModal({ type: null }),
                  variant: "outline",
                  children: "Cancel",
                }),
                _jsx(Button, {
                  onClick: handleDelete,
                  className: "bg-red-600 hover:bg-red-700 text-white",
                  children: "Delete",
                }),
              ],
            }),
          ],
        }),
      }),
      _jsxs("div", {
        className:
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8",
        children: [
          _jsxs("div", {
            children: [
              _jsx("h1", {
                className: "text-4xl font-extrabold text-gray-900",
                children: "Staff Management",
              }),
              _jsx("p", {
                className: "text-gray-500 text-lg mt-1",
                children:
                  "Manage library staff and administrators (Admin Only)",
              }),
            ],
          }),
          _jsx(Button, {
            onClick: () => setShowAddModal(true),
            className:
              "bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900",
            children: "+ Add Staff",
          }),
        ],
      }),
      _jsx("div", {
        className: "mb-8",
        children: _jsx(Input, {
          type: "text",
          placeholder: "Search staff by username",
          className:
            "w-full max-w-xl px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }),
      }),
      isLoading
        ? _jsx("div", {
            className: "flex items-center justify-center h-64",
            children: _jsx(Loader2, {
              className: "w-8 h-8 animate-spin text-indigo-600",
            }),
          })
        : error
        ? _jsx("div", {
            className: "bg-red-50 border-l-4 border-red-400 p-4",
            children: _jsxs("div", {
              className: "flex",
              children: [
                _jsx("div", {
                  className: "flex-shrink-0",
                  children: _jsx("svg", {
                    className: "h-5 w-5 text-red-400",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: _jsx("path", {
                      fillRule: "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                      clipRule: "evenodd",
                    }),
                  }),
                }),
                _jsxs("div", {
                  className: "ml-3",
                  children: [
                    _jsx("p", {
                      className: "text-sm text-red-700",
                      children:
                        "Failed to load staff members. Please try again later.",
                    }),
                    _jsxs("p", {
                      className: "text-xs text-red-600 mt-1",
                      children: ["Error: ", error?.message || "Unknown error"],
                    }),
                    _jsxs("p", {
                      className: "text-xs text-red-600",
                      children: [
                        "Status: ",
                        error?.response?.status || "Unknown",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
        : filteredStaff.length > 0
        ? _jsx("div", {
            className:
              "grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            children: filteredStaff.map((staff) =>
              _jsx(
                StaffCard,
                {
                  staff: staff,
                  onView: () => setModal({ type: "view", staff }),
                  onEdit: () => setModal({ type: "edit", staff }),
                  onDelete: () => setModal({ type: "delete", staff }),
                },
                staff.id
              )
            ),
          })
        : _jsxs("div", {
            className: "text-center py-12 bg-white rounded-lg shadow",
            children: [
              _jsx("div", {
                className:
                  "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100",
                children: _jsx(UserCog, { className: "h-6 w-6 text-gray-400" }),
              }),
              _jsx("h3", {
                className: "mt-2 text-sm font-medium text-gray-900",
                children: "No staff members found",
              }),
              _jsx("p", {
                className: "mt-1 text-sm text-gray-500",
                children: searchTerm
                  ? "Try adjusting your search criteria."
                  : "Get started by adding a new staff member.",
              }),
              _jsx("div", {
                className: "mt-6",
                children: _jsxs(Button, {
                  as: Link,
                  to: "/staff/new",
                  variant: "outline",
                  children: [
                    _jsx(Plus, { className: "-ml-1 mr-2 h-4 w-4" }),
                    "Add Staff",
                  ],
                }),
              }),
            ],
          }),
    ],
  });
}
