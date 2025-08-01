import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Signup from "./Signup";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    const result = await login({ email, password });
    if (result?.success) navigate(from, { replace: true });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow  p-8 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-md p-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Library Manager System
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 text-sm font-medium ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="flex justify-between ">
          <p className="text-sm text-gray-600">Don't have an account? </p>
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            Sign up
          </Link>
        </div>

        <div className="border-t pt-4 text-sm text-gray-600 text-center">
          <p className="mb-1 font-medium">Test Credentials:</p>
          <p>
            <span className="font-medium">Admin:</span> admin1@lab.com /
            admin123
          </p>
          <p>
            <span className="font-medium">Librarian:</span> librarian@lab.com /
            librarian123
          </p>
        </div>
      </div>
    </div>
  );
}
