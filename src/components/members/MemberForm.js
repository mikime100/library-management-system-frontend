import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle, } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import Input from "../../components/ui/Input";
const memberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    joinDate: z.string().optional(),
});
export default function MemberForm({ defaultValues, isEditing = false, onSuccess, }) {
    const navigate = useNavigate();
    const { control, register, handleSubmit, formState: { errors, isSubmitting }, setError, } = useForm({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            joinDate: new Date().toISOString().split("T")[0],
            ...defaultValues,
        },
    });
    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone || "",
            };
            if (isEditing && defaultValues?.id) {
                const response = await api.patch(`/members/${defaultValues.id}`, payload);
            }
            else {
                const response = await api.post("/members", payload);
            }
            if (onSuccess) {
                onSuccess();
            }
            else {
                navigate("/members");
            }
        }
        catch (err) {
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
    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return _jsx(CheckCircle2, { className: "h-4 w-4 text-green-500" });
            case "inactive":
                return _jsx(Clock, { className: "h-4 w-4 text-yellow-500" });
            case "suspended":
                return _jsx(XCircle, { className: "h-4 w-4 text-red-500" });
            default:
                return null;
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-xl mx-auto", children: [!isEditing && (_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-1", children: "Add New Member" }), _jsx("p", { className: "text-gray-500", children: "Enter the details for the new member." })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx(Input, { ...register("name"), placeholder: "Enter full name", error: errors.name?.message, fullWidth: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx(Input, { ...register("email"), placeholder: "Enter email address", error: errors.email?.message, fullWidth: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number" }), _jsx(Input, { ...register("phone"), placeholder: "Enter phone number", error: errors.phone?.message, fullWidth: true })] }), !isEditing && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Join Date" }), _jsx(Input, { type: "date", ...register("joinDate"), error: errors.joinDate?.message, fullWidth: true })] }))] }), _jsxs("div", { className: "flex justify-end gap-4 mt-8", children: [_jsx("button", { type: "button", className: "px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold", onClick: () => (onSuccess ? onSuccess() : navigate("/members")), disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition", disabled: isSubmitting, children: isSubmitting
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Create Member" })] })] }));
}
