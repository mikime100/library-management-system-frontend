import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, AlertTriangle } from "lucide-react";
export default function OverdueBooks({ count }) {
  return _jsxs("div", {
    className: "bg-white shadow overflow-hidden sm:rounded-lg",
    children: [
      _jsxs("div", {
        className: "px-4 py-5 sm:px-6 border-b border-gray-200",
        children: [
          _jsx("h3", {
            className: "text-lg leading-6 font-medium text-gray-900",
            children: "Overdue Books",
          }),
          _jsx("p", {
            className: "mt-1 max-w-2xl text-sm text-gray-500",
            children: "Books that are past their due date",
          }),
        ],
      }),
      _jsx("div", {
        className: "px-4 py-5 sm:p-6",
        children:
          count > 0
            ? _jsxs("div", {
                className: "flex items-center",
                children: [
                  _jsx("div", {
                    className: "flex-shrink-0 bg-red-100 p-3 rounded-full",
                    children: _jsx(AlertTriangle, {
                      className: "h-6 w-6 text-red-600",
                    }),
                  }),
                  _jsxs("div", {
                    className: "ml-4",
                    children: [
                      _jsxs("h4", {
                        className: "text-lg font-medium text-gray-900",
                        children: [
                          count,
                          " ",
                          count === 1 ? "book is" : "books are",
                          " overdue",
                        ],
                      }),
                      _jsx("p", {
                        className: "text-sm text-gray-500",
                        children:
                          "These books should be returned as soon as possible.",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "ml-auto",
                    children: _jsx("button", {
                      type: "button",
                      className:
                        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                      children: "View all",
                    }),
                  }),
                ],
              })
            : _jsxs("div", {
                className: "text-center py-8",
                children: [
                  _jsx("div", {
                    className:
                      "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100",
                    children: _jsx(Clock, {
                      className: "h-6 w-6 text-green-600",
                    }),
                  }),
                  _jsx("h3", {
                    className: "mt-2 text-sm font-medium text-gray-900",
                    children: "No overdue books",
                  }),
                  _jsx("p", {
                    className: "mt-1 text-sm text-gray-500",
                    children: "All books have been returned on time.",
                  }),
                ],
              }),
      }),
    ],
  });
}
