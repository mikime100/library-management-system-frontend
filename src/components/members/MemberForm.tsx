import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  User,
  X,
  Upload,
  Mail,
  Phone,
  Calendar,
  Hash,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { format } from "date-fns";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import DatePicker from "../../components/ui/DatePicker";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  joinDate: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  defaultValues?: Partial<MemberFormData> & { id?: string };
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function MemberForm({
  defaultValues,
  isEditing = false,
  onSuccess,
}: MemberFormProps) {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      ...defaultValues,
    },
  });

  const onSubmit = async (data: MemberFormData) => {
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      };

      if (isEditing && defaultValues?.id) {
        const response = await api.patch(
          `/members/${defaultValues.id}`,
          payload
        );
      } else {
        const response = await api.post("/members", payload);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/members");
      }
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "An error occurred",
      });
    }
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-xl mx-auto"
    >
      {!isEditing && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Add New Member</h2>
          <p className="text-gray-500">Enter the details for the new member.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input
            {...register("name")}
            placeholder="Enter full name"
            error={errors.name?.message}
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
            Phone Number
          </label>
          <Input
            {...register("phone")}
            placeholder="Enter phone number"
            error={errors.phone?.message}
            fullWidth
          />
        </div>
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Date
            </label>
            <Input
              type="date"
              {...register("joinDate")}
              error={errors.joinDate?.message}
              fullWidth
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold"
          onClick={() => (onSuccess ? onSuccess() : navigate("/members"))}
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
            : "Create Member"}
        </button>
      </div>
    </form>
  );
}
