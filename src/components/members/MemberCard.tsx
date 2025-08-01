import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";
import type { Member } from "../../pages/Members";

import MemberForm from "./MemberForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "@/lib/api";

interface MemberCardProps {
  member: Member;
  onChange?: () => void;
}

import { useState } from "react";

export default function MemberCard({ member, onChange }: MemberCardProps) {
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
  } as const;

  const statusIcons = {
    active: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    inactive: <Clock className="h-3.5 w-3.5 mr-1" />,
    suspended: <XCircle className="h-3.5 w-3.5 mr-1" />,
  } as const;

  return (
    <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6 relative hover:shadow-xl transition-shadow duration-200 min-h-[270px]">
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
            statusColors[member.status]
          }`}
        >
          {member.status === "active"
            ? `${member.borrowedBooks} active`
            : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {member.image ? (
            <img
              className="h-12 w-12 rounded-full"
              src={member.image}
              alt={member.name}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
          )}
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{member.name}</div>
          <div className="text-sm text-gray-500">{member.email}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-600 mt-2">
        {member.phone && <div>Phone: {member.phone}</div>}
        <div>Joined: {new Date(member.joinDate).toLocaleDateString()}</div>
        <div>Active Borrows: {member.borrowedBooks}</div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400"
          title="View"
          onClick={() => setShowViewModal(true)}
        >
          <Eye className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400"
          title="Edit"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 text-red-600 focus:ring-2 focus:ring-red-400"
          title="Delete"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={member.name}
        widthClass="max-w-md"
      >
        <div className="mb-1 text-gray-600">Member Details</div>
        <div className="mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{member.email}</span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{member.phone}</span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>
            Joined:{" "}
            {member.joinDate
              ? new Date(member.joinDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>Active Borrows: {member.borrowedBooks}</span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span>Status: </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
              statusColors[member.status]
            }`}
          >
            {statusIcons[member.status]}
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </span>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Member"
        widthClass="max-w-md"
      >
        {successMsg && (
          <div className="mb-2 p-2 rounded bg-green-100 text-green-800 text-center text-sm font-medium">
            {successMsg}
          </div>
        )}
        <div className="mb-3 text-gray-600">
          Update the member information below.
        </div>
        <MemberForm
          defaultValues={member}
          isEditing={true}
          onSuccess={() => {
            setShowEditModal(false);
            setSuccessMsg("Member updated successfully!");
            setTimeout(() => setSuccessMsg(""), 2500);
            if (onChange) onChange();
          }}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Member"
        widthClass="max-w-md"
      >
        {successMsg && (
          <div className="mb-2 p-2 rounded bg-green-100 text-green-800 text-center text-sm font-medium">
            {successMsg}
          </div>
        )}
        <div className="mb-4">
          Are you sure you want to delete "{member.name}"? This action cannot be
          undone.
        </div>
        {deleteError && <div className="text-red-600 mb-2">{deleteError}</div>}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white"
            onClick={async () => {
              setDeleteLoading(true);
              setDeleteError("");
              try {
                await api.delete(`/members/${member.id}`);
                setShowDeleteModal(false);
                setSuccessMsg("Member deleted successfully!");
                setTimeout(() => setSuccessMsg(""), 2500);
                if (onChange) onChange();
              } catch (err: any) {
                const rawMsg =
                  err?.response?.data?.message ||
                  err?.message ||
                  "Failed to delete member.";
                if (rawMsg.includes("FOREIGN KEY constraint failed")) {
                  setDeleteError(
                    "This member cannot be deleted because they have borrowing records. Please remove or reassign those records first."
                  );
                } else {
                  setDeleteError(rawMsg);
                }
              } finally {
                setDeleteLoading(false);
              }
            }}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
