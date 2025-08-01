import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "404 - Page Not Found" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "The page you're looking for doesn't exist." })] }), _jsx("div", { className: "mt-8", children: _jsxs(Link, { to: "/", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [_jsx(ArrowLeft, { className: "-ml-1 mr-2 h-5 w-5" }), "Go Back Home"] }) })] }) }));
}
