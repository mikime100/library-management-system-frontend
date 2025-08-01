import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Filter,
  Loader2,
  UserCog,
  Shield,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

import StaffCard from ".././components/staff/StaffCard";
import Button from ".././components/ui/Button";
import Input from ".././components/ui/Input";
import Select from ".././components/ui/Select";
import StaffForm from "../components/staff/StaffForm";
import Modal from "../components/ui/Modal";
import { Routes, Route } from "react-router-dom";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "librarian";
  joinDate: string;
  status: "active" | "inactive";
  lastLogin?: string;
  image?: string;
}

const fetchStaff = async (): Promise<StaffMember[]> => {
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

    return staffArray.map((s: any) => ({
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
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function Staff() {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [modal, setModal] = useState<{
    type: null | "view" | "edit" | "delete";
    staff?: StaffMember;
  }>({ type: null });

  const {
    data: staffMembers = [],
    isLoading,
    error,
    refetch,
  } = useQuery<StaffMember[]>({
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
      refetch();
    } catch (err) {
      alert("Failed to delete staff member.");
    }
  };

  return (
    <div className="px-8 py-8">
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Staff"
        widthClass="max-w-xl"
      >
        <StaffForm
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={modal.type === "view"}
        onClose={() => setModal({ type: null })}
        title="Staff Details"
        widthClass="max-w-md"
      >
        {modal.staff && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {modal.staff.image ? (
                <img
                  className="h-16 w-16 rounded-full"
                  src={modal.staff.image}
                  alt={modal.staff.name}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  {modal.staff.role === "admin" ? (
                    <Shield className="h-8 w-8 text-indigo-600" />
                  ) : (
                    <User className="h-8 w-8 text-indigo-600" />
                  )}
                </div>
              )}
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {modal.staff.name}
                </div>
                <div className="text-sm text-gray-500">{modal.staff.email}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Phone: {modal.staff.phone || "-"}</div>
              <div>
                Role:{" "}
                {modal.staff.role.charAt(0).toUpperCase() +
                  modal.staff.role.slice(1)}
              </div>
              <div>
                Status:{" "}
                {modal.staff.status.charAt(0).toUpperCase() +
                  modal.staff.status.slice(1)}
              </div>
              <div>
                Created:{" "}
                {modal.staff.joinDate
                  ? new Date(modal.staff.joinDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modal.type === "edit"}
        onClose={() => setModal({ type: null })}
        title="Edit Staff"
        widthClass="max-w-xl"
      >
        {modal.staff && (
          <StaffForm
            defaultValues={{
              id: modal.staff.id,
              username: modal.staff.name,
              email: modal.staff.email,
              role: modal.staff.role,
            }}
            isEditing
            onSuccess={() => {
              setModal({ type: null });
              refetch();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null })}
        title="Delete Staff Member"
        widthClass="max-w-sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-bold">{modal.staff?.name}</span>?
          </p>
          <div className="flex justify-end gap-4">
            <Button onClick={() => setModal({ type: null })} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Staff Management
          </h1>
          <p className="text-gray-500 text-lg mt-1">
            Manage library staff and administrators (Admin Only)
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900"
        >
          + Add Staff
        </Button>
      </div>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search staff by username"
          className="w-full max-w-xl px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
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
                Failed to load staff members. Please try again later.
              </p>
              <p className="text-xs text-red-600 mt-1">
                Error: {error?.message || "Unknown error"}
              </p>
              <p className="text-xs text-red-600">
                Status: {(error as any)?.response?.status || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      ) : filteredStaff.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onView={() => setModal({ type: "view", staff })}
              onEdit={() => setModal({ type: "edit", staff })}
              onDelete={() => setModal({ type: "delete", staff })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <UserCog className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No staff members found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Get started by adding a new staff member."}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/staff/new" variant="outline">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
