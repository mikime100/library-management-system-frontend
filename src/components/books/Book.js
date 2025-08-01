import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Book({ book }) {
    const genreName = typeof book.genre === "string" ? book.genre : book.genre?.name || "Unknown";
    return (_jsxs("div", { className: "p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx("h3", { className: "font-semibold text-lg mb-1", children: book.title }), _jsxs("p", { className: "text-gray-600", children: ["by ", book.author] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Published: ", book.publishedYear] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Genre: ", genreName] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Available: ", book.availableCopies] })] }));
}
