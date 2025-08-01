import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import {
  Home,
  BookOpen,
  Users,
  UserCog,
  Tag,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  BarChart2,
  Repeat,
} from "lucide-react";
import { ReactNode } from "react";

const getNavigationForRole = (role: string) => {
  if (role === "admin") {
    return [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Books", href: "/books", icon: BookOpen },
      { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
      { name: "Members", href: "/members", icon: Users },
      { name: "Staff", href: "/staff", icon: UserCog },
      { name: "Reports", href: "/reports", icon: BarChart2 },
      { name: "Genres", href: "/genres", icon: Tag },
    ];
  } else if (role === "librarian") {
    return [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Books", href: "/books", icon: BookOpen },
      { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
    ];
  }
  return [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Books", href: "/books", icon: BookOpen },
    { name: "Borrow/Return", href: "/borrow-return", icon: Repeat },
  ];
};

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = getNavigationForRole(user?.role || "");

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden fixed inset-0 flex z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="fixed inset-0">
          <div
            className="absolute inset-0 bg-gray-600 opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">LibraryMS</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14">
          {/* Force close button */}
          <button
            className="h-12 w-12 flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-100">
              <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">
                Library Manager
              </h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-semibold rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 flex flex-col items-center border-t border-gray-100 p-6">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <User className="h-7 w-7 text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-900">
                  {user?.name || "admin"}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    user?.role === "admin"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-200 text-gray-700 border border-gray-300"
                  }`}
                >
                  {user?.role ? user.role.toUpperCase() : "ADMIN"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-100">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-6 flex items-center justify-between">
            <div>{/* Optionally add a page title here */}</div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Welcome, {user?.name || "admin"}
              </span>
              <div className="relative">
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>
                {userDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div
            className="py-6
          "
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children ? children : <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
