import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, UserPlus, Filter, Loader2 } from "lucide-react";
import { Link, Routes, Route } from "react-router-dom";
import api from "@/lib/api";
import { fetchMembers } from "@/lib/api";

import MemberCard from "../components/members/MemberCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import MemberForm from "../components/members/MemberForm";
import Modal from "../components/ui/Modal";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipNumber: string;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  borrowedBooks: number;
  totalBorrowed: number;
  image?: string;
}

import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function Members() {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="px-8 py-8">
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Member"
        widthClass="max-w-xl"
      >
        <MemberForm
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      </Modal>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Members</h1>
          <p className="text-gray-500 text-lg mt-1">Manage library members</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900"
        >
          + Add Member
        </Button>
      </div>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search members by name"
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
                Failed to load members. Please try again later.
              </p>
            </div>
          </div>
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} onChange={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <UserPlus className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No members found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Get started by adding a new member."}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/members/new" variant="outline">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
