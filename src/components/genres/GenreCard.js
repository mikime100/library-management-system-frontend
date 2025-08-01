import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useState } from "react";
import toast from "react-hot-toast";
export default function GenreCard({ genre, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(genre.name);
  const handleSave = () => {
    if (name.trim() && name !== genre.name) {
      onEdit(name.trim());
    }
    setEditing(false);
  };
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the genre "${genre.name}"? This action cannot be undone.`
      )
    ) {
      onDelete();
      toast.error(`Genre "${genre.name}" deleted successfully!`);
    }
  };
  return _jsxs("div", {
    className:
      "bg-white rounded-2xl shadow p-6 relative hover:shadow-xl transition-shadow duration-200",
    children: [
      _jsxs("div", {
        className: "absolute top-4 right-4 flex gap-2",
        children: [
          editing
            ? _jsxs(_Fragment, {
                children: [
                  _jsx("button", {
                    type: "button",
                    onClick: handleSave,
                    className:
                      "inline-flex items-center justify-center w-8 h-8 rounded bg-green-100 hover:bg-green-200 text-green-700",
                    title: "Save",
                    children: _jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-4 w-4",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      children: _jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7",
                      }),
                    }),
                  }),
                  _jsx("button", {
                    type: "button",
                    onClick: () => {
                      setEditing(false);
                      setName(genre.name);
                    },
                    className:
                      "inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700",
                    title: "Cancel",
                    children: _jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-4 w-4",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      children: _jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M6 18L18 6M6 6l12 12",
                      }),
                    }),
                  }),
                ],
              })
            : _jsx("button", {
                type: "button",
                onClick: () => setEditing(true),
                className:
                  "inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700",
                title: "Edit",
                children: _jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-4 w-4",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: _jsx("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z",
                  }),
                }),
              }),
          _jsx("button", {
            type: "button",
            onClick: handleDelete,
            className:
              "inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100 hover:bg-red-100 text-red-600",
            title: "Delete",
            children: _jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-4 w-4",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: _jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
              }),
            }),
          }),
        ],
      }),
      _jsxs("div", {
        className: "mt-8",
        children: [
          editing
            ? _jsx("input", {
                className:
                  "text-xl font-bold text-gray-900 mb-2 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500",
                value: name,
                onChange: (e) => setName(e.target.value),
                autoFocus: true,
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setName(genre.name);
                  }
                },
              })
            : _jsx("h3", {
                className: "text-xl font-bold text-gray-900 mb-2",
                children: genre.name,
              }),
          _jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["Genre ID: ", genre.id],
          }),
        ],
      }),
    ],
  });
}
