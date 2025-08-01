import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GenreCard from "../components/genres/GenreCard";
import Modal from "../components/ui/Modal";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function Genres() {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return _jsx(Navigate, { to: "/login", replace: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [addError, setAddError] = useState("");
  const queryClient = useQueryClient();
  const {
    data: genres = [],
    isLoading,
    error,
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
  const [deleteError, setDeleteError] = useState("");
  const deleteGenre = useMutation({
    mutationFn: async (id) => {
      setDeleteError("");
      await api.delete(`/genres/${id}`);
    },
    onError: (err) => {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      if (
        backendMsg.includes("FOREIGN KEY constraint failed") ||
        backendMsg.toLowerCase().includes("foreign key")
      ) {
        setDeleteError(
          "This genre cannot be deleted because there are books associated with it. Please remove or reassign those books before deleting the genre."
        );
      } else {
        const errorMessage =
          err?.response?.data?.message ||
          "Failed to delete genre. Please try again.";
        toast.error(errorMessage);
        setDeleteError(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
  const updateGenre = useMutation({
    mutationFn: async ({ id, name }) => {
      await api.patch(`/genres/${id}`, { name });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success(`Genre "${variables.name}" updated successfully!`);
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to update genre. Please try again.";
      toast.error(errorMessage);
    },
  });
  const addGenre = useMutation({
    mutationFn: async (name) => {
      setAddError("");
      await api.post("/genres", { name });
    },
    onError: (err) => {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      const errorMessage =
        backendMsg || "Failed to add genre. Please try again.";
      toast.error(errorMessage);
      setAddError(errorMessage);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      setAddModalOpen(false);
      setNewGenreName("");
      setAddError("");
      toast.success(`Genre "${variables}" added successfully!`);
    },
  });
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const renderAddGenreModal = () =>
    _jsxs(Modal, {
      isOpen: addModalOpen,
      onClose: () => {
        setAddModalOpen(false);
        setAddError("");
      },
      title: "Add New Genre",
      children: [
        _jsx("p", {
          className: "mb-4 text-gray-600",
          children: "Enter the name for the new genre.",
        }),
        _jsxs("form", {
          onSubmit: (e) => {
            e.preventDefault();
            if (!newGenreName.trim()) {
              setAddError("Genre name is required.");
              return;
            }
            addGenre.mutate(newGenreName.trim());
          },
          children: [
            _jsx("label", {
              className: "block mb-2 font-medium",
              children: "Genre Name",
            }),
            _jsx(Input, {
              type: "text",
              placeholder: "e.g., Science Fiction",
              value: newGenreName,
              onChange: (e) => setNewGenreName(e.target.value),
              className: "mb-2",
              autoFocus: true,
            }),
            addError &&
              _jsx("div", {
                className: "mb-2 text-red-600 text-sm",
                children: addError,
              }),
            _jsxs("div", {
              className: "flex justify-end gap-2 mt-4",
              children: [
                _jsx(Button, {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setAddModalOpen(false);
                    setAddError("");
                  },
                  children: "Cancel",
                }),
                _jsx(Button, {
                  type: "submit",
                  className: "bg-black text-white",
                  disabled: addGenre.status === "pending",
                  children:
                    addGenre.status === "pending" ? "Creating..." : "Add Genre",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  return _jsxs("div", {
    className: "px-8 py-8",
    children: [
      renderAddGenreModal(),
      _jsxs("div", {
        className:
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8",
        children: [
          _jsxs("div", {
            children: [
              _jsx("h1", {
                className: "text-4xl font-extrabold text-gray-900",
                children: "Genres",
              }),
              _jsx("p", {
                className: "text-gray-500 text-lg mt-1",
                children: "Manage book genres (Admin Only)",
              }),
            ],
          }),
          _jsx(Button, {
            type: "button",
            className:
              "bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900",
            onClick: () => setAddModalOpen(true),
            children: "+ Add Genre",
          }),
        ],
      }),
      _jsx("div", {
        className: "mb-8",
        children: _jsx(Input, {
          type: "text",
          placeholder: "Search genres...",
          className:
            "w-full max-w-xl px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }),
      }),
      deleteError &&
        _jsx("div", {
          className:
            "mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm",
          children: deleteError,
        }),
      isLoading
        ? _jsx("div", {
            className: "flex items-center justify-center h-64",
            children: _jsx("div", {
              className:
                "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
            }),
          })
        : error
        ? _jsx("div", {
            className: "bg-red-50 border-l-4 border-red-400 p-4",
            children: _jsxs("div", {
              className: "flex",
              children: [
                _jsx("div", {
                  className: "flex-shrink-0",
                  children: _jsx("svg", {
                    className: "h-5 w-5 text-red-400",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: _jsx("path", {
                      fillRule: "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                      clipRule: "evenodd",
                    }),
                  }),
                }),
                _jsx("div", {
                  className: "ml-3",
                  children: _jsx("p", {
                    className: "text-sm text-red-700",
                    children: "Failed to load genres. Please try again later.",
                  }),
                }),
              ],
            }),
          })
        : filteredGenres.length > 0
        ? _jsx("div", {
            className:
              "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            children: filteredGenres.map((genre) =>
              _jsx(
                GenreCard,
                {
                  genre: genre,
                  onDelete: () => deleteGenre.mutate(genre.id),
                  onEdit: (name) => updateGenre.mutate({ id: genre.id, name }),
                },
                genre.id
              )
            ),
          })
        : _jsxs("div", {
            className: "text-center py-12 bg-white rounded-lg shadow",
            children: [
              _jsx("div", {
                className:
                  "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100",
                children: _jsx(Plus, { className: "h-6 w-6 text-gray-400" }),
              }),
              _jsx("h3", {
                className: "mt-2 text-sm font-medium text-gray-900",
                children: "No genres found",
              }),
              _jsx("p", {
                className: "mt-1 text-sm text-gray-500",
                children: searchTerm
                  ? "Try adjusting your search criteria."
                  : "Get started by adding a new genre.",
              }),
              _jsx("div", {
                className: "mt-6",
                children: _jsxs(Button, {
                  as: Link,
                  to: "/genres/new",
                  variant: "outline",
                  children: [
                    _jsx(Plus, { className: "-ml-1 mr-2 h-4 w-4" }),
                    "Add Genre",
                  ],
                }),
              }),
            ],
          }),
    ],
  });
}
