import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Loader2, BookOpen } from "lucide-react";
import api from "@/lib/api";
import BookCard from ".././components/books/BookCard";
import Input from ".././components/ui/Input";
import Modal from "../components/ui/Modal";
import BookForm from "../components/books/BookForm";
const fetchBooks = async () => {
    const { data } = await api.get("/books");
    return data.map((book) => ({
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
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: "Loading..." }));
    }
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    try {
        const [searchTerm, setSearchTerm] = useState("");
        const [statusFilter, setStatusFilter] = useState("all");
        const [genreFilter, setGenreFilter] = useState("all");
        const [modal, setModal] = useState(null);
        const [deleteLoading, setDeleteLoading] = useState(false);
        const [deleteError, setDeleteError] = useState("");
        const [deleteSuccess, setDeleteSuccess] = useState("");
        const [editSuccess, setEditSuccess] = useState("");
        const queryClient = useQueryClient();
        const { data: books = [], isLoading, error, } = useQuery({
            queryKey: ["books"],
            queryFn: fetchBooks,
        });
        const genres = [
            "all",
            ...new Set(books.map((book) => {
                if (typeof book.genre === "object" && book.genre !== null) {
                    return book.genre.name;
                }
                return book.genre;
            })),
        ];
        const filteredBooks = books.filter((book) => {
            try {
                const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === "all" ||
                    (statusFilter === "available" && book.availableCopies > 0) ||
                    (statusFilter === "unavailable" && book.availableCopies === 0);
                const bookGenre = typeof book.genre === "object" && book.genre !== null
                    ? book.genre.name
                    : book.genre;
                const matchesGenre = genreFilter === "all" ||
                    bookGenre.toLowerCase() === genreFilter.toLowerCase();
                return matchesSearch && matchesStatus && matchesGenre;
            }
            catch (error) {
                console.error("Error filtering book:", book, error);
                return false;
            }
        });
        if (isLoading) {
            return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-indigo-600" }) }));
        }
        if (error) {
            return (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "Failed to load books. Please try again later." }) })] }) }));
        }
        return (_jsxs("div", { className: "space-y-6", children: [editSuccess && (_jsx("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 mb-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-green-700", children: editSuccess }) })] }) })), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-extrabold text-gray-900", children: "Books" }), _jsx("p", { className: "mt-1 text-lg text-gray-500", children: "Manage your library's book collection" })] }), _jsxs("button", { className: "flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-800 transition", onClick: () => setModal({ type: "add" }), children: [_jsx(Plus, { className: "h-5 w-5" }), " Add Book"] })] }), _jsx("div", { className: "bg-white shadow rounded-lg p-4", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx(Input, { type: "text", placeholder: "Search books by title", className: "pl-10 w-full text-lg", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }) }), filteredBooks.length > 0 ? (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filteredBooks.map((book) => (_jsx("div", { children: _jsx(BookCard, { book: book, onView: () => setModal({ type: "view", book }), onEdit: () => setModal({ type: "edit", book }), onDelete: () => setModal({ type: "delete", book }) }) }, book.id))) })) : (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: [_jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No books found" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: searchTerm
                                ? "Try adjusting your search or filter criteria."
                                : "Get started by adding a new book." }), _jsx("div", { className: "mt-6", children: _jsxs("button", { className: "flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-800 transition", onClick: () => setModal({ type: "add" }), children: [_jsx(Plus, { className: "h-5 w-5" }), " Add Book"] }) })] })), _jsx(Modal, { isOpen: !!modal && modal.type === "view", onClose: () => setModal(null), title: modal?.book?.title || "Book Details", widthClass: "max-w-md", children: modal?.book && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-gray-500 text-lg mb-2", children: "Book Details" }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold", children: "Author:" }), " ", _jsx("span", { children: typeof modal.book.author === "object" &&
                                            modal.book.author !== null
                                            ? modal.book.author.name
                                            : modal.book.author })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold", children: "Genre:" }), " ", _jsx("span", { className: "bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold", children: typeof modal.book.genre === "object" &&
                                            modal.book.genre !== null
                                            ? modal.book.genre.name
                                            : modal.book.genre })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold", children: "Published:" }), " ", _jsx("span", { children: modal.book.publishedYear })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold", children: "Available:" }), " ", _jsxs("span", { className: "bg-black text-white rounded-full px-3 py-1 text-sm font-semibold", children: [modal.book.availableCopies, " copies"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold", children: "Status:" }), " ", _jsx("span", { className: `rounded-full px-3 py-1 text-sm font-semibold ${modal.book.availableCopies > 0
                                            ? "bg-black text-white"
                                            : "bg-red-500 text-white"}`, children: modal.book.availableCopies > 0
                                            ? "Available"
                                            : "Out of Stock" })] })] })) }), _jsx(Modal, { isOpen: !!modal && modal.type === "edit", onClose: () => setModal(null), title: "Edit Book", widthClass: "max-w-lg", children: modal?.book && (_jsx(BookForm, { defaultValues: {
                            ...modal.book,
                            genre: typeof modal.book.genre === "string"
                                ? modal.book.genre
                                : modal.book.genre?.id?.toString() || "",
                        }, isEditing: true, onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["books"] });
                            setModal(null);
                            setEditSuccess("Book edited successfully.");
                            setTimeout(() => setEditSuccess(""), 3000);
                        } })) }), _jsx(Modal, { isOpen: !!modal && modal.type === "delete", onClose: () => setModal(null), title: "Delete Book", widthClass: "max-w-md", children: modal?.book && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-lg", children: ["Are you sure you want to delete \"", modal.book.title, "\"? This action cannot be undone."] }), deleteError && (_jsx("div", { className: "text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm", children: deleteError })), deleteSuccess && (_jsx("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 mb-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-green-700", children: deleteSuccess }) })] }) })), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold", onClick: () => {
                                            setDeleteError("");
                                            setModal(null);
                                        }, disabled: deleteLoading, children: "Cancel" }), _jsx("button", { className: "px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition", onClick: async () => {
                                            if (!modal?.book)
                                                return;
                                            setDeleteLoading(true);
                                            setDeleteError("");
                                            try {
                                                await api.delete(`/books/${modal.book.id}`);
                                                queryClient.invalidateQueries({ queryKey: ["books"] });
                                                setModal(null);
                                                setDeleteSuccess("Book deleted successfully.");
                                                setTimeout(() => setDeleteSuccess(""), 3000);
                                            }
                                            catch (err) {
                                                console.log("Delete error:", err);
                                                const backendMsg = err?.response?.data?.message || err?.message || "";
                                                if (err?.response?.status === 409 ||
                                                    backendMsg.includes("borrow/return records") ||
                                                    backendMsg.includes("FOREIGN KEY constraint failed")) {
                                                    setDeleteError("This book cannot be deleted because it has borrow/return records. Remove those records first.");
                                                }
                                                else {
                                                    setDeleteError("Failed to delete book. Please try again.");
                                                }
                                            }
                                            finally {
                                                setDeleteLoading(false);
                                            }
                                        }, disabled: deleteLoading, children: deleteLoading ? "Deleting..." : "Delete" })] })] })) }), _jsx(Modal, { isOpen: !!modal && modal.type === "add", onClose: () => setModal(null), title: "Add New Book", widthClass: "max-w-lg", children: _jsx(BookForm, { onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["books"] });
                            setModal(null);
                        } }) })] }));
    }
    catch (error) {
        console.error("Error in Books component:", error);
        return (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "Something went wrong. Please refresh the page and try again." }) })] }) }));
    }
}
