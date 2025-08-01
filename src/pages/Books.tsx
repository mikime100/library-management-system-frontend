import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Filter, Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

import BookCard from ".././components/books/BookCard";
import Button from ".././components/ui/Button";
import Input from ".././components/ui/Input";
import Select from ".././components/ui/Select";
import Modal from "../components/ui/Modal";
import BookForm from "../components/books/BookForm";

export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  genre: string | { id: string; name: string };
  availableCopies: number;
  description?: string;
  coverImage?: string;
}

const fetchBooks = async (): Promise<Book[]> => {
  const { data } = await api.get("/books");

  return data.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    publishedYear: book.published_year,
    genre: book.genre,
    availableCopies: book.available_copies,
    description: book.description,
    coverImage: book.cover_image,
  }));
};

import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function Books() {
  const { isAuthenticated, user, loading } = useUserStore();
  console.log("isAuthenticated:", isAuthenticated, "user:", user);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  try {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [genreFilter, setGenreFilter] = useState("all");
    const [modal, setModal] = useState<null | {
      type: "view" | "edit" | "delete" | "add";
      book?: Book;
    }>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const queryClient = useQueryClient();

    const {
      data: books = [],
      isLoading,
      error,
    } = useQuery<Book[]>({
      queryKey: ["books"],
      queryFn: fetchBooks,
    });

    const genres = [
      "all",
      ...new Set(
        books.map((book) => {
          if (typeof book.genre === "object" && book.genre !== null) {
            return book.genre.name;
          }
          return book.genre;
        })
      ),
    ];

    const filteredBooks = books.filter((book) => {
      try {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "available" && book.availableCopies > 0) ||
          (statusFilter === "unavailable" && book.availableCopies === 0);

        const bookGenre =
          typeof book.genre === "object" && book.genre !== null
            ? book.genre.name
            : book.genre;

        const matchesGenre =
          genreFilter === "all" ||
          bookGenre.toLowerCase() === genreFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesGenre;
      } catch (error) {
        console.error("Error filtering book:", book, error);
        return false;
      }
    });

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      );
    }

    if (error) {
      return (
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
                Failed to load books. Please try again later.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {editSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{editSuccess}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Books</h1>
            <p className="mt-1 text-lg text-gray-500">
              Manage your library's book collection
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-800 transition"
            onClick={() => setModal({ type: "add" })}
          >
            <Plus className="h-5 w-5" /> Add Book
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search books by title"
              className="pl-10 w-full text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <div key={book.id}>
                <BookCard
                  book={book}
                  onView={() => setModal({ type: "view", book })}
                  onEdit={() => setModal({ type: "edit", book })}
                  onDelete={() => setModal({ type: "delete", book })}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No books found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding a new book."}
            </p>
            <div className="mt-6">
              <button
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-800 transition"
                onClick={() => setModal({ type: "add" })}
              >
                <Plus className="h-5 w-5" /> Add Book
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={!!modal && modal.type === "view"}
          onClose={() => setModal(null)}
          title={modal?.book?.title || "Book Details"}
          widthClass="max-w-md"
        >
          {modal?.book && (
            <div className="space-y-4">
              <div className="text-gray-500 text-lg mb-2">Book Details</div>
              <div className="flex justify-between">
                <span className="font-semibold">Author:</span>{" "}
                <span>
                  {typeof modal.book.author === "object" &&
                  modal.book.author !== null
                    ? (modal.book.author as { name: string }).name
                    : modal.book.author}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Genre:</span>{" "}
                <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold">
                  {typeof modal.book.genre === "object" &&
                  modal.book.genre !== null
                    ? (modal.book.genre as { name: string }).name
                    : modal.book.genre}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Published:</span>{" "}
                <span>{modal.book.publishedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Available:</span>{" "}
                <span className="bg-black text-white rounded-full px-3 py-1 text-sm font-semibold">
                  {modal.book.availableCopies} copies
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    modal.book.availableCopies > 0
                      ? "bg-black text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {modal.book.availableCopies > 0
                    ? "Available"
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={!!modal && modal.type === "edit"}
          onClose={() => setModal(null)}
          title="Edit Book"
          widthClass="max-w-lg"
        >
          {modal?.book && (
            <BookForm
              defaultValues={{
                ...modal.book,
                genre:
                  typeof modal.book.genre === "string"
                    ? modal.book.genre
                    : modal.book.genre?.id?.toString() || "",
              }}
              isEditing
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["books"] });
                setModal(null);
                setEditSuccess("Book edited successfully.");
                setTimeout(() => setEditSuccess(""), 3000);
              }}
            />
          )}
        </Modal>
        <Modal
          isOpen={!!modal && modal.type === "delete"}
          onClose={() => setModal(null)}
          title="Delete Book"
          widthClass="max-w-md"
        >
          {modal?.book && (
            <div className="space-y-6">
              <div className="text-lg">
                Are you sure you want to delete "{modal.book.title}"? This
                action cannot be undone.
              </div>
              {deleteError && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm">
                  {deleteError}
                </div>
              )}
              {deleteSuccess && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{deleteSuccess}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold"
                  onClick={() => {
                    setDeleteError("");
                    setModal(null);
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  onClick={async () => {
                    if (!modal?.book) return;
                    setDeleteLoading(true);
                    setDeleteError("");
                    try {
                      await api.delete(`/books/${modal.book.id}`);
                      queryClient.invalidateQueries({ queryKey: ["books"] });
                      setModal(null);
                      setDeleteSuccess("Book deleted successfully.");
                      setTimeout(() => setDeleteSuccess(""), 3000);
                    } catch (err: any) {
                      console.log("Delete error:", err);
                      const backendMsg =
                        err?.response?.data?.message || err?.message || "";
                      if (
                        err?.response?.status === 409 ||
                        backendMsg.includes("borrow/return records") ||
                        backendMsg.includes("FOREIGN KEY constraint failed")
                      ) {
                        setDeleteError(
                          "This book cannot be deleted because it has borrow/return records. Remove those records first."
                        );
                      } else {
                        setDeleteError(
                          "Failed to delete book. Please try again."
                        );
                      }
                    } finally {
                      setDeleteLoading(false);
                    }
                  }}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={!!modal && modal.type === "add"}
          onClose={() => setModal(null)}
          title="Add New Book"
          widthClass="max-w-lg"
        >
          <BookForm
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["books"] });
              setModal(null);
            }}
          />
        </Modal>
      </div>
    );
  } catch (error) {
    console.error("Error in Books component:", error);
    return (
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
              Something went wrong. Please refresh the page and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
