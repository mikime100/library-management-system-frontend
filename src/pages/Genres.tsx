import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GenreCard from "../components/genres/GenreCard";
import Modal from "../components/ui/Modal";

import type { Genre } from "../types/genre";

import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function Genres() {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [addError, setAddError] = useState("");
  const queryClient = useQueryClient();

  const {
    data: genres = [],
    isLoading,
    error,
  } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await api.get("/genres");

      return data.map((g: any) => ({
        id: g.id?.toString() ?? "",
        name: typeof g.name === "string" ? g.name : "",
      }));
    },
  });

  const [deleteError, setDeleteError] = useState("");
  const deleteGenre = useMutation({
    mutationFn: async (id: string) => {
      setDeleteError("");
      await api.delete(`/genres/${id}`);
    },
    onError: (err: any) => {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      if (
        backendMsg.includes("FOREIGN KEY constraint failed") ||
        backendMsg.toLowerCase().includes("foreign key")
      ) {
        setDeleteError(
          "This genre cannot be deleted because there are books associated with it. Please remove or reassign those books before deleting the genre."
        );
      } else {
        setDeleteError("Failed to delete genre. Please try again.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const updateGenre = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await api.patch(`/genres/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const addGenre = useMutation({
    mutationFn: async (name: string) => {
      setAddError("");
      await api.post("/genres", { name });
    },
    onError: (err: any) => {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      setAddError(backendMsg || "Failed to add genre. Please try again.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      setAddModalOpen(false);
      setNewGenreName("");
      setAddError("");
    },
  });

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAddGenreModal = () => (
    <Modal
      isOpen={addModalOpen}
      onClose={() => {
        setAddModalOpen(false);
        setAddError("");
      }}
      title="Add New Genre"
    >
      <p className="mb-4 text-gray-600">Enter the name for the new genre.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newGenreName.trim()) {
            setAddError("Genre name is required.");
            return;
          }
          addGenre.mutate(newGenreName.trim());
        }}
      >
        <label className="block mb-2 font-medium">Genre Name</label>
        <Input
          type="text"
          placeholder="Enter genre name"
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
          className="mb-2"
          autoFocus
        />
        {addError && (
          <div className="mb-2 text-red-600 text-sm">{addError}</div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAddModalOpen(false);
              setAddError("");
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-black text-white"
            disabled={addGenre.status === "pending"}
          >
            {addGenre.status === "pending" ? "Creating..." : "Create Genre"}
          </Button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="px-8 py-8">
      {renderAddGenreModal()}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Genres</h1>
          <p className="text-gray-500 text-lg mt-1">
            Manage book genres (Admin Only)
          </p>
        </div>
        <Button
          type="button"
          className="bg-black text-white px-6 py-3 text-base font-semibold rounded-lg shadow hover:bg-gray-900"
          onClick={() => setAddModalOpen(true)}
        >
          + Add Genre
        </Button>
      </div>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search genres..."
          className="w-full max-w-xl px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {deleteError && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm">
          {deleteError}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Failed to load genres. Please try again later.
              </p>
            </div>
          </div>
        </div>
      ) : filteredGenres.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGenres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onDelete={() => deleteGenre.mutate(genre.id)}
              onEdit={(name) => updateGenre.mutate({ id: genre.id, name })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No genres found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Get started by adding a new genre."}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/genres/new" variant="outline">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Genre
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
