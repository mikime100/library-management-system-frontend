import { create } from "zustand";
export const useBookStore = create((set, get) => ({
    books: [],
    selectedBook: null,
    searchQuery: "",
    filters: {
        genre: [],
        author: [],
        availability: "all",
        language: [],
    },
    sortBy: "title",
    sortOrder: "asc",
    loading: false,
    error: null,
    fetchBooks: async () => {
        set({ loading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const mockAuthors = [
                {
                    id: "a1",
                    name: "F. Scott Fitzgerald",
                    birthYear: 1896,
                    deathYear: 1940,
                    nationality: "American",
                },
                {
                    id: "a2",
                    name: "Harper Lee",
                    birthYear: 1926,
                    deathYear: 2016,
                    nationality: "American",
                },
                {
                    id: "a3",
                    name: "George Orwell",
                    birthYear: 1903,
                    deathYear: 1950,
                    nationality: "British",
                },
            ];
            const mockBooks = [
                {
                    id: "b1",
                    isbn: "9780743273565",
                    title: "The Great Gatsby",
                    authors: [mockAuthors[0]],
                    publisher: "Scribner",
                    publicationYear: 1925,
                    genre: ["Classic", "Fiction", "Literary"],
                    description: "A story of decadence and excess, The Great Gatsby explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.",
                    pageCount: 180,
                    language: "English",
                    coverImage: "https://example.com/great-gatsby.jpg",
                    totalCopies: 5,
                    availableCopies: 3,
                    location: "Fiction Section, Shelf 4",
                    addedDate: "2023-01-15",
                    updatedAt: "2023-01-15T10:30:00Z",
                },
                {
                    id: "b2",
                    isbn: "9780061120084",
                    title: "To Kill a Mockingbird",
                    authors: [mockAuthors[1]],
                    publisher: "J. B. Lippincott & Co.",
                    publicationYear: 1960,
                    genre: ["Classic", "Fiction", "Historical"],
                    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960.",
                    pageCount: 281,
                    language: "English",
                    coverImage: "https://example.com/mockingbird.jpg",
                    totalCopies: 3,
                    availableCopies: 0,
                    location: "Fiction Section, Shelf 2",
                    addedDate: "2023-02-10",
                    updatedAt: "2023-06-01T14:45:00Z",
                },
                {
                    id: "b3",
                    isbn: "9780451524935",
                    title: "1984",
                    authors: [mockAuthors[2]],
                    publisher: "Secker & Warburg",
                    publicationYear: 1949,
                    genre: ["Dystopian", "Science Fiction", "Classic"],
                    description: "1984 is a dystopian social science fiction novel and cautionary tale. Thematically, it centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of people and behaviours within society.",
                    pageCount: 328,
                    language: "English",
                    coverImage: "https://example.com/1984.jpg",
                    totalCopies: 4,
                    availableCopies: 2,
                    location: "Science Fiction Section, Shelf 1",
                    addedDate: "2023-03-05",
                    updatedAt: "2023-05-20T09:15:00Z",
                },
            ];
            set({ books: mockBooks, loading: false });
        }
        catch (error) {
            set({
                error: error.message || "Failed to fetch books",
                loading: false,
            });
        }
    },
    getBookById: (id) => {
        return get().books.find((book) => book.id === id);
    },
    searchBooks: (query) => {
        set({ searchQuery: query });
    },
    addBook: async (bookData) => {
        set({ loading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const newBook = {
                ...bookData,
                id: `book-${Date.now()}`,
                availableCopies: bookData.totalCopies,
                addedDate: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString(),
            };
            set((state) => ({
                books: [...state.books, newBook],
                loading: false,
            }));
            return { success: true };
        }
        catch (error) {
            set({
                error: error.message || "Failed to add book",
                loading: false,
            });
            return { success: false };
        }
    },
    updateBook: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            set((state) => {
                const updatedBooks = state.books.map((book) => book.id === id
                    ? {
                        ...book,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                    }
                    : book);
                return {
                    books: updatedBooks,
                    selectedBook: state.selectedBook?.id === id
                        ? updatedBooks.find((b) => b.id === id) || null
                        : state.selectedBook,
                    loading: false,
                };
            });
            return { success: true };
        }
        catch (error) {
            set({
                error: error.message || "Failed to update book",
                loading: false,
            });
            return { success: false };
        }
    },
    deleteBook: async (id) => {
        set({ loading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            set((state) => ({
                books: state.books.filter((book) => book.id !== id),
                selectedBook: state.selectedBook?.id === id ? null : state.selectedBook,
                loading: false,
            }));
            return { success: true };
        }
        catch (error) {
            set({
                error: error.message || "Failed to delete book",
                loading: false,
            });
            return { success: false };
        }
    },
    updateBookCopies: (bookId, change) => {
        set((state) => {
            const updatedBooks = state.books.map((book) => book.id === bookId
                ? {
                    ...book,
                    availableCopies: Math.max(0, Math.min(book.availableCopies + change, book.totalCopies)),
                    updatedAt: new Date().toISOString(),
                }
                : book);
            return {
                books: updatedBooks,
                selectedBook: state.selectedBook?.id === bookId
                    ? updatedBooks.find((b) => b.id === bookId) || null
                    : state.selectedBook,
            };
        });
    },
    setFilters: (filters) => {
        set((state) => ({
            filters: {
                ...state.filters,
                ...filters,
            },
        }));
    },
    setSort: (sortBy, sortOrder) => {
        set((state) => ({
            sortBy,
            sortOrder: sortOrder ||
                (state.sortBy === sortBy && state.sortOrder === "asc" ? "desc" : "asc"),
        }));
    },
    selectBook: (book) => {
        set({ selectedBook: book });
    },
    clearError: () => {
        set({ error: null });
    },
}));
