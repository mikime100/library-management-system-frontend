import { useUserStore } from "@/store/userStore";
import { Shield, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Profile() {
  const { user } = useUserStore();

  const permissions =
    user?.role === "admin"
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
        <h1 className="text-3xl font-extrabold mb-4">Profile</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{user?.name || "User"}</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              {user?.role?.toUpperCase() || "ADMIN"}
            </span>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">{user?.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">{user?.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">
              Member Since:{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow  p-6 mt-8">
          <h2 className="text-xl font-bold mb-2">Permissions & Access</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Your current role permissions
          </p>
          <ul className="space-y-2">
            {permissions.map((perm, idx) => (
              <li
                key={idx}
                className="flex items-center text-green-700 font-medium"
              >
                <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                {perm}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
