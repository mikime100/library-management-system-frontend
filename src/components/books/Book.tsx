import type { Book } from "../../pages/Books";

interface BookProps {
  book: Book;
}

export default function Book({ book }: BookProps) {
  const genreName =
    typeof book.genre === "string" ? book.genre : book.genre?.name || "Unknown";

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
      <p className="text-gray-600">by {book.author}</p>
      <p className="text-sm text-gray-500">Published: {book.publishedYear}</p>
      <p className="text-sm text-gray-500">Genre: {genreName}</p>
      <p className="text-sm text-gray-500">Available: {book.availableCopies}</p>
    </div>
  );
}
