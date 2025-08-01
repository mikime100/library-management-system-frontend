import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  UserCog,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

interface StaffCardProps {
  staff: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "librarian";
    joinDate: string;
    status: "active" | "inactive";
    lastLogin?: string;
    image?: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function StaffCard({
  staff,
  onView,
  onEdit,
  onDelete,
}: StaffCardProps) {
  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    librarian: "bg-blue-100 text-blue-800",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const statusIcons = {
    active: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    inactive: <XCircle className="h-3.5 w-3.5 mr-1" />,
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6 relative hover:shadow-xl transition-shadow duration-200 min-h-[270px]">
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
            staff.role === "admin"
              ? "bg-red-100 text-red-800"
              : "bg-black text-white"
          }`}
        >
          {staff.role === "admin" ? "ADMIN" : "LIBRARIAN"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {staff.image ? (
            <img
              className="h-12 w-12 rounded-full"
              src={staff.image}
              alt={staff.name}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              {staff.role === "admin" ? (
                <Shield className="h-6 w-6 text-indigo-600" />
              ) : (
                <User className="h-6 w-6 text-indigo-600" />
              )}
            </div>
          )}
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{staff.name}</div>
          <div className="text-sm text-gray-500">{staff.email}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-600 mt-2">
        {staff.phone && <div>Phone: {staff.phone}</div>}
        <div>Created: {new Date(staff.joinDate).toLocaleDateString()}</div>
        <div>
          Role: {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          title="View"
          onClick={onView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          title="Edit"
          onClick={onEdit}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 text-red-600"
          title="Delete"
          onClick={onDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
