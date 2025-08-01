import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BookOpen } from "lucide-react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    const result = await login({ email, password });
    if (result?.success) navigate(from, { replace: true });
    setIsSubmitting(false);
  };
  return _jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-50 px-4",
    children: _jsxs("div", {
      className: "w-full max-w-md bg-white rounded-xl shadow  p-8 space-y-6",
      children: [
        _jsxs("div", {
          className: "text-center",
          children: [
            _jsx("div", {
              className: "flex justify-center mb-4",
              children: _jsx("div", {
                className: "bg-blue-600 rounded-md p-3",
                children: _jsx(BookOpen, { className: "w-6 h-6 text-white" }),
              }),
            }),
            _jsx("h2", {
              className: "text-2xl font-bold text-gray-900",
              children: "Library Manager System",
            }),
            _jsx("p", {
              className: "text-sm text-gray-500 mt-1",
              children: "Sign in to your account to continue",
            }),
          ],
        }),
        error &&
          _jsx("div", {
            className: "text-red-600 text-sm p-2 bg-red-50 rounded-md",
            children: error,
          }),
        _jsxs("form", {
          onSubmit: handleSubmit,
          className: "space-y-5",
          children: [
            _jsxs("div", {
              children: [
                _jsx("label", {
                  className: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Email",
                }),
                _jsx("input", {
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "Enter your email",
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm",
                }),
              ],
            }),
            _jsxs("div", {
              children: [
                _jsx("label", {
                  className: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Password",
                }),
                _jsxs("div", {
                  className: "relative",
                  children: [
                    _jsx("input", {
                      type: showPassword ? "text" : "password",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      placeholder: "Enter your password",
                      className:
                        "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm pr-10",
                    }),
                    _jsx("button", {
                      type: "button",
                      tabIndex: -1,
                      className:
                        "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700",
                      onClick: () => setShowPassword((prev) => !prev),
                      children: showPassword
                        ? _jsx(EyeOff, { className: "h-4 w-4" })
                        : _jsx(Eye, { className: "h-4 w-4" }),
                    }),
                  ],
                }),
              ],
            }),
            _jsx("button", {
              type: "submit",
              disabled: isSubmitting,
              className: `w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 text-sm font-medium ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`,
              children: isSubmitting
                ? _jsxs("div", {
                    className: "flex justify-center items-center space-x-2",
                    children: [
                      _jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
                      _jsx("span", { children: "Signing in..." }),
                    ],
                  })
                : "Sign in",
            }),
          ],
        }),
        _jsxs("div", {
          className: "flex justify-between ",
          children: [
            _jsx("p", {
              className: "text-sm text-gray-600",
              children: "Don't have an account? ",
            }),
            _jsx(Link, {
              to: "/signup",
              className: "text-indigo-600 hover:underline text-sm font-medium",
              children: "Sign up",
            }),
          ],
        }),
        _jsxs("div", {
          className: "border-t pt-4 text-sm text-gray-600 text-center",
          children: [
            _jsx("p", {
              className: "mb-1 font-medium",
              children: "Test Credentials:",
            }),
            _jsxs("p", {
              children: [
                _jsx("span", { className: "font-medium", children: "Admin:" }),
                " admin1@lab.com / admin123",
              ],
            }),
            _jsxs("p", {
              children: [
                _jsx("span", {
                  className: "font-medium",
                  children: "Librarian:",
                }),
                " librarian@lab.com / librarian123",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
