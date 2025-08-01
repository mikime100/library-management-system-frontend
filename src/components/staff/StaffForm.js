import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
const staffSchema = z
    .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "librarian"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
})
    .refine((data) => {
    return data.password === data.passwordConfirmation;
}, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
});
export default function StaffForm({ defaultValues, isEditing = false, onSuccess, }) {
    const navigate = useNavigate();
    const { control, register, handleSubmit, watch, formState: { errors, isSubmitting }, setError, } = useForm({
        resolver: zodResolver(staffSchema),
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
    const onSubmit = async (data) => {
        try {
            if (isEditing && defaultValues?.id) {
                const payload = {
                    email: data.email,
                    role: data.role,
                };
                if (data.username)
                    payload.username = data.username;
                await api.patch(`/staff/${defaultValues.id}`, payload);
            }
            else {
                await api.post("/staff", {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    role: data.role,
                });
            }
            toast.success(isEditing ? "Staff updated successfully!" : "Staff added successfully!");
            if (onSuccess) {
                onSuccess();
            }
            else {
                navigate("/staff");
            }
        }
        catch (error) {
            console.log("PATCH error:", error.response);
            const errorMessage = error.response?.data?.message || "An error occurred";
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    setError(field, {
                        type: "manual",
                        message: Array.isArray(message) ? message[0] : String(message),
                    });
                });
            }
            else {
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
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-xl mx-auto", children: [errors.root?.message && (_jsx("div", { className: "mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2", children: errors.root.message })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Username" }), _jsx(Input, { ...register("username"), placeholder: "Enter username", error: errors.username?.message, fullWidth: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx(Input, { ...register("email"), placeholder: "Enter email address", error: errors.email?.message, fullWidth: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { ...register("role"), className: "w-full border rounded px-3 py-2", children: [_jsx("option", { value: "librarian", children: "Librarian" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx(Input, { ...register("password"), type: "password", placeholder: "Enter password", error: errors.password?.message, fullWidth: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password" }), _jsx(Input, { ...register("passwordConfirmation"), type: "password", placeholder: "Confirm password", error: errors.passwordConfirmation?.message, fullWidth: true })] })] }), _jsxs("div", { className: "flex justify-end gap-4 mt-8", children: [_jsx("button", { type: "button", className: "px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold", onClick: () => (onSuccess ? onSuccess() : navigate("/staff")), disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition", disabled: isSubmitting, children: isSubmitting
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Create Staff" })] })] }));
}
