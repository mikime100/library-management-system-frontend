import axios from "axios";
// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://back-end-for-assessment.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});
// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
// Shared fetchMembers function for consistent member data mapping
export const fetchMembers = async () => {
  const { data } = await api.get("/members");
  // Accept both array and { members: [...] } shapes
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data.members)
    ? data.members
    : [];
  return arr.map((m) => ({
    id: m.id?.toString() ?? "",
    name: typeof m.name === "string" ? m.name : "",
    email: typeof m.email === "string" ? m.email : "",
    phone: typeof m.phone === "string" ? m.phone : "",
    membershipNumber:
      typeof m.membershipNumber === "string"
        ? m.membershipNumber
        : m.membershipNumber?.toString?.() ?? "",
    joinDate: typeof m.joinDate === "string" ? m.joinDate : "",
    status:
      m.status === "active" ||
      m.status === "inactive" ||
      m.status === "suspended"
        ? m.status
        : "active",
    borrowedBooks: typeof m.borrowedBooks === "number" ? m.borrowedBooks : 0,
    totalBorrowed: typeof m.totalBorrowed === "number" ? m.totalBorrowed : 0,
    image: typeof m.image === "string" ? m.image : undefined,
  }));
};
