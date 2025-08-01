import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, Edit, Trash2 } from "lucide-react";
export default function BookCard({ book, onView, onEdit, onDelete }) {
  const isAvailable = book.availableCopies > 0;
  return _jsx("div", {
    className:
      "bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200",
    children: _jsxs("div", {
      className: "p-4",
      children: [
        _jsxs("div", {
          className: "flex flex-col gap-2",
          children: [
            _jsx("h3", {
              className: "text-xl font-bold text-gray-900 mb-1",
              children: book.title,
            }),
            _jsxs("p", {
              className: "text-gray-600 mb-1",
              children: [
                "by",
                " ",
                typeof book.author === "object" && book.author !== null
                  ? book.author.name
                  : book.author,
              ],
            }),
            _jsxs("div", {
              className: "text-sm text-gray-500 mb-1",
              children: [
                "Genre:",
                " ",
                typeof book.genre === "object" && book.genre !== null
                  ? book.genre.name
                  : book.genre,
              ],
            }),
            _jsxs("div", {
              className: "text-sm text-gray-500 mb-1",
              children: ["Published: ", book.publishedYear],
            }),
            _jsxs("div", {
              className: "text-sm text-gray-500 mb-1",
              children: ["Available Copies: ", book.availableCopies],
            }),
            _jsx("div", {
              className: "flex gap-2 mt-2",
              children: _jsx("span", {
                className: `px-3 py-1 rounded-full text-xs font-bold ${
                  isAvailable ? "bg-black text-white" : "bg-red-500 text-white"
                }`,
                children: isAvailable ? "Available" : "Out of Stock",
              }),
            }),
          ],
        }),
        _jsxs("div", {
          className: "flex justify-end gap-2 mt-4",
          children: [
            _jsx("button", {
              type: "button",
              className: "p-2 rounded hover:bg-gray-100",
              "aria-label": "View book details",
              onClick: onView,
              children: _jsx(Eye, { className: "h-5 w-5" }),
            }),
            _jsx("button", {
              type: "button",
              className: "p-2 rounded hover:bg-gray-100",
              "aria-label": "Edit book",
              onClick: onEdit,
              children: _jsx(Edit, { className: "h-5 w-5" }),
            }),
            _jsx("button", {
              type: "button",
              className: "p-2 rounded hover:bg-gray-100",
              "aria-label": "Delete book",
              onClick: onDelete,
              children: _jsx(Trash2, { className: "h-5 w-5 text-red-500" }),
            }),
          ],
        }),
      ],
    }),
  });
}
