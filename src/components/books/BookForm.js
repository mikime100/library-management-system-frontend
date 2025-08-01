import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedYear: z.coerce
    .number()
    .min(1000, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  genre: z.string().min(1, "Genre is required"),
  availableCopies: z.coerce.number().int().min(0, "Cannot be negative"),
});
export default function BookForm({
  defaultValues,
  isEditing = false,
  onSuccess,
}) {
  const navigate = useNavigate();
  // Fetch genres from API
  const {
    data: genres = [],
    isLoading: genresLoading,
    error: genresError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await api.get("/genres");
      return data.map((g) => ({
        id: g.id?.toString() ?? "",
        name: typeof g.name === "string" ? g.name : "",
      }));
    },
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publishedYear: new Date().getFullYear(),
      genre: "",
      availableCopies: 1,
      ...defaultValues,
    },
  });
  const availableCopies = watch("availableCopies");
  const onSubmit = async (data) => {
    try {
      if (isEditing && defaultValues?.id) {
        // Map frontend fields to backend fields for update
        const payload = {
          title: data.title,
          author: data.author,
          published_year: Number(data.publishedYear),
          genre_id: Number(data.genre),
          available_copies: Number(data.availableCopies),
        };
        await api.patch(`/books/${defaultValues.id}`, payload);
      } else {
        const payload = {
          title: data.title,
          author: data.author,
          published_year: Number(data.publishedYear),
          genre_id: Number(data.genre),
          available_copies: Number(data.availableCopies),
        };
        await api.post("/books", payload);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/books");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, message]) => {
            setError(field, {
              type: "manual",
              message: Array.isArray(message) ? message[0] : String(message),
            });
          }
        );
      } else {
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };
  return _jsxs("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "space-y-6 max-w-xl mx-auto",
    children: [
      errors.root?.message &&
        _jsx("div", {
          className: "bg-red-50 border-l-4 border-red-400 p-4 mb-6",
          children: _jsxs("div", {
            className: "flex",
            children: [
              _jsx("div", {
                className: "flex-shrink-0",
                children: _jsx(X, { className: "h-5 w-5 text-red-400" }),
              }),
              _jsx("div", {
                className: "ml-3",
                children: _jsx("p", {
                  className: "text-sm text-red-700",
                  children: errors.root.message,
                }),
              }),
            ],
          }),
        }),
      errors.root &&
        _jsx("div", {
          className: "bg-red-50 border-l-4 border-red-400 p-4 mb-6",
          children: _jsxs("div", {
            className: "flex",
            children: [
              _jsx("div", {
                className: "flex-shrink-0",
                children: _jsx(X, { className: "h-5 w-5 text-red-400" }),
              }),
              _jsx("div", {
                className: "ml-3",
                children: _jsx("p", {
                  className: "text-sm text-red-700",
                  children: errors.root.message,
                }),
              }),
            ],
          }),
        }),
      _jsxs("div", {
        className: "bg-white shadow overflow-hidden sm:rounded-lg",
        children: [
          _jsxs("div", {
            className: "px-4 py-5 sm:px-6 border-b border-gray-200",
            children: [
              _jsx("h3", {
                className: "text-lg leading-6 font-medium text-gray-900",
                children: isEditing ? "Edit Book" : "Add New Book",
              }),
              _jsx("p", {
                className: "mt-1 max-w-2xl text-sm text-gray-500",
                children: isEditing
                  ? "Update the book details below."
                  : "Fill in the details to add a new book to the library.",
              }),
            ],
          }),
          _jsxs("div", {
            className: "px-4 py-5 sm:p-6 space-y-6",
            children: [
              _jsxs("div", {
                className:
                  "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5",
                children: [
                  _jsxs("label", {
                    htmlFor: "title",
                    className:
                      "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2",
                    children: [
                      "Title ",
                      _jsx("span", {
                        className: "text-red-500",
                        children: "*",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "mt-1 sm:mt-0 sm:col-span-2",
                    children: _jsx(Input, {
                      id: "title",
                      ...register("title"),
                      error: errors.title?.message,
                      placeholder: "Enter book title",
                      fullWidth: true,
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5",
                children: [
                  _jsxs("label", {
                    htmlFor: "author",
                    className:
                      "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2",
                    children: [
                      "Author ",
                      _jsx("span", {
                        className: "text-red-500",
                        children: "*",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "mt-1 sm:mt-0 sm:col-span-2",
                    children: _jsx(Input, {
                      id: "author",
                      ...register("author"),
                      error: errors.author?.message,
                      placeholder: "Enter author name",
                      fullWidth: true,
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5",
                children: [
                  _jsxs("label", {
                    htmlFor: "publishedYear",
                    className:
                      "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2",
                    children: [
                      "Published Year ",
                      _jsx("span", {
                        className: "text-red-500",
                        children: "*",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "mt-1 sm:mt-0 sm:col-span-2",
                    children: _jsx(Input, {
                      id: "publishedYear",
                      type: "number",
                      ...register("publishedYear"),
                      error: errors.publishedYear?.message,
                      placeholder: "e.g., 2023",
                      fullWidth: true,
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5",
                children: [
                  _jsxs("label", {
                    htmlFor: "genre",
                    className:
                      "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2",
                    children: [
                      "Genre ",
                      _jsx("span", {
                        className: "text-red-500",
                        children: "*",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "mt-1 sm:mt-0 sm:col-span-2",
                    children: [
                      _jsx(Controller, {
                        name: "genre",
                        control: control,
                        render: ({ field }) =>
                          _jsxs(Select, {
                            id: "genre",
                            ...field,
                            error: errors.genre?.message,
                            disabled: genresLoading,
                            children: [
                              _jsx("option", {
                                value: "",
                                children: genresLoading
                                  ? "Loading genres..."
                                  : "Select a genre",
                              }),
                              genres.map((genre) =>
                                _jsx(
                                  "option",
                                  { value: genre.id, children: genre.name },
                                  genre.id
                                )
                              ),
                            ],
                          }),
                      }),
                      genresError &&
                        _jsx("p", {
                          className: "mt-2 text-sm text-red-600",
                          children: "Failed to load genres. Please try again.",
                        }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5",
                children: [
                  _jsxs("label", {
                    htmlFor: "availableCopies",
                    className:
                      "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2",
                    children: [
                      "Available Copies ",
                      _jsx("span", {
                        className: "text-red-500",
                        children: "*",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "mt-1 sm:mt-0 sm:col-span-2",
                    children: _jsx(Input, {
                      id: "availableCopies",
                      type: "number",
                      min: "0",
                      ...register("availableCopies"),
                      error: errors.availableCopies?.message,
                      fullWidth: true,
                    }),
                  }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "px-4 py-3 bg-gray-50 text-right sm:px-6",
            children: [
              _jsx(Button, {
                type: "button",
                variant: "outline",
                onClick: () => navigate(-1),
                className: "mr-3",
                as: "button",
                to: "",
                children: "Cancel",
              }),
              _jsx(Button, {
                type: "submit",
                disabled: isSubmitting,
                variant: "primary",
                as: "button",
                to: "",
                children: isSubmitting
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsxs("svg", {
                          className:
                            "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          children: [
                            _jsx("circle", {
                              className: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              strokeWidth: "4",
                            }),
                            _jsx("path", {
                              className: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                            }),
                          ],
                        }),
                        isEditing ? "Updating..." : "Creating...",
                      ],
                    })
                  : isEditing
                  ? "Update Book"
                  : "Add Book",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
