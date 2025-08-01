import { Eye, Edit, Trash2 } from "lucide-react";
import type { Book } from "../../pages/Books";

interface BookCardProps {
  book: Book;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BookCard({
  book,
  onView,
  onEdit,
  onDelete,
}: BookCardProps) {
  const isAvailable = book.availableCopies > 0;
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-gray-600 mb-1">
            by{" "}
            {typeof book.author === "object" && book.author !== null
              ? (book.author as { name: string }).name
              : book.author}
          </p>
          <div className="text-sm text-gray-500 mb-1">
            Genre:{" "}
            {typeof book.genre === "object" && book.genre !== null
              ? (book.genre as { name: string }).name
              : book.genre}
          </div>
          <div className="text-sm text-gray-500 mb-1">
            Published: {book.publishedYear}
          </div>
          <div className="text-sm text-gray-500 mb-1">
            Available Copies: {book.availableCopies}
          </div>
          <div className="flex gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isAvailable ? "bg-black text-white" : "bg-red-500 text-white"
              }`}
            >
              {isAvailable ? "Available" : "Out of Stock"}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            aria-label="View book details"
            onClick={onView}
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Edit book"
            onClick={onEdit}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Delete book"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
