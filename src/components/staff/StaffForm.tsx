import { useForm, Controller, Resolver } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  User,
  X,
  Upload,
  Mail,
  Phone,
  Lock,
  UserCog,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { format } from "date-fns";
import api from "@/lib/api";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import DatePicker from "@/components/ui/DatePicker";

const staffSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "librarian"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    }
  );

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  defaultValues?: Partial<StaffFormData> & { id?: string };
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function StaffForm({
  defaultValues,
  isEditing = false,
  onSuccess,
}: StaffFormProps) {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema) as Resolver<StaffFormData>,
    defaultValues: {
      username: "",
      email: "",
      role: "librarian",
      password: "",
      passwordConfirmation: "",
      ...defaultValues,
    },
  });

  const role = watch("role");
  const password = watch("password");

  const onSubmit = async (data: StaffFormData) => {
    try {
      if (isEditing && defaultValues?.id) {
        const payload: any = {
          email: data.email,
          role: data.role,
        };
        if (data.username) payload.username = data.username;
        await api.patch(`/staff/${defaultValues.id}`, payload);
      } else {
        await api.post("/staff", {
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role,
        });
      }
      toast.success(
        isEditing ? "Staff updated successfully!" : "Staff added successfully!"
      );
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/staff");
      }
    } catch (error: any) {
      console.log("PATCH error:", error.response);
      const errorMessage = error.response?.data?.message || "An error occurred";
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, message]) => {
            setError(field as keyof StaffFormData, {
              type: "manual",
              message: Array.isArray(message) ? message[0] : String(message),
            });
          }
        );
      } else {
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "librarian", label: "Librarian" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-xl mx-auto"
    >
      {errors.root?.message && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">
          {errors.root.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <Input
            {...register("username")}
            placeholder="Enter username"
            error={errors.username?.message}
            fullWidth
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            {...register("email")}
            placeholder="Enter email address"
            error={errors.email?.message}
            fullWidth
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            {...register("role")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            fullWidth
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <Input
            {...register("passwordConfirmation")}
            type="password"
            placeholder="Confirm password"
            error={errors.passwordConfirmation?.message}
            fullWidth
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold"
          onClick={() => (onSuccess ? onSuccess() : navigate("/staff"))}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Save Changes"
            : "Create Staff"}
        </button>
      </div>
    </form>
  );
}
