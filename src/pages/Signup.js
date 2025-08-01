import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("librarian");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const { signup, error } = useUserStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!username || !email || !password || !confirmPassword) {
            setFormError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }
        setIsSubmitting(true);
        const result = await signup({ email, username, password, role });
        setIsSubmitting(false);
        if (result.success) {
            navigate("/");
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 px-4", children: _jsxs("div", { className: "w-full max-w-xl space-y-6 bg-white p-8 rounded-xl shadow-md", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Create an account" }), _jsx("p", { className: "text-sm text-gray-500", children: "Library Management System" })] }), (formError || error) && (_jsx("div", { className: "text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-md", children: formError || error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700 mb-1", children: "Username" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "username", name: "username", type: "text", required: true, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Your username", className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-900" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-900" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-900" }), _jsx("button", { type: "button", tabIndex: -1, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700", onClick: () => setShowPassword((v) => !v), "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: showConfirmPassword ? "text" : "password", required: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-900" }), _jsx("button", { type: "button", tabIndex: -1, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700", onClick: () => setShowConfirmPassword((v) => !v), "aria-label": showConfirmPassword ? "Hide password" : "Show password", children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { id: "role", name: "role", value: role, onChange: (e) => setRole(e.target.value), className: "w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-900", children: [_jsx("option", { value: "librarian", children: "Librarian" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isSubmitting, className: `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin -ml-1 mr-2 h-4 w-4" }), "Signing up..."] })) : ("Sign up") }) }), _jsxs("div", { className: "text-center mt-2", children: [_jsxs("span", { className: "text-gray-600 text-sm", children: ["Already have an account?", " "] }), _jsx(Link, { to: "/login", className: "text-indigo-600 hover:underline text-sm font-medium", children: "Sign in" })] })] })] }) }));
}
