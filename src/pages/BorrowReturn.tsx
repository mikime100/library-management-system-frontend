import { useState, useEffect } from "react";
import { useBorrowReturnStore } from "@/store/borrowReturnStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import { fetchMembers } from "@/lib/api";

export default function BorrowReturn() {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [borrowForm, setBorrowForm] = useState({
    bookId: "",
    memberId: "",
    dueDate: new Date(),
  });
  const [returnForm, setReturnForm] = useState({
    borrowId: "",
  });
  const [borrowError, setBorrowError] = useState("");
  const [returnError, setReturnError] = useState("");
  const [returnSuccess, setReturnSuccess] = useState("");

  const {
    borrowRecords,
    fetchBorrowRecords,
    borrowBook,
    returnBook,
    loading,
    error,
  } = useBorrowReturnStore();

  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: async () => (await api.get("/books")).data,
  });
  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  useEffect(() => {
    fetchBorrowRecords();
  }, [fetchBorrowRecords]);

  const handleBorrow = async () => {
    setBorrowError("");
    if (!borrowForm.bookId || !borrowForm.memberId || !borrowForm.dueDate) {
      setBorrowError("Please select a valid book and member.");
      return;
    }

    const book = books.find((b: any) => b.id === borrowForm.bookId);
    const member = members.find((m: any) => m.id === borrowForm.memberId);

    if (!book || !member) {
      setBorrowError("Please select a valid book and member.");
      return;
    }

    const payload = {
      bookId: borrowForm.bookId,
      bookTitle: book.title,
      memberId: borrowForm.memberId,
      memberName: member.name,
      dueDate: borrowForm.dueDate.toISOString().split("T")[0],
    };

    console.log("Borrow payload:", payload);
    const res = await borrowBook(payload);
    if (res.success) {
      setShowBorrowModal(false);
      setBorrowForm({
        bookId: "",
        memberId: "",
        dueDate: new Date(),
      });
      fetchBorrowRecords();
    } else {
      setBorrowError("Failed to borrow book.");
    }
  };

  const handleReturn = async () => {
    setReturnError("");
    if (!returnForm.borrowId) {
      setReturnError("Please select a borrow record.");
      return;
    }
    const res = await returnBook(returnForm.borrowId);
    console.log("Return result:", res);
    if (res.success) {
      setShowReturnModal(false);
      setReturnForm({ borrowId: "" });
      fetchBorrowRecords();
      setReturnSuccess("Book returned successfully.");
      setTimeout(() => setReturnSuccess(""), 3000);
    } else {
      setReturnError("Failed to return book.");
    }
  };

  const handleMarkReturned = async (borrowId: string) => {
    await returnBook(borrowId);
    fetchBorrowRecords();
  };

  const statusBadge = (status: string) => {
    if (status === "overdue")
      return (
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          OVERDUE
        </span>
      );
    if (status === "returned")
      return (
        <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold">
          RETURNED
        </span>
      );
    return (
      <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
        ACTIVE
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Borrow & Return
          </h1>
          <p className="text-gray-500 text-base">
            Manage book borrowing and return operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowBorrowModal(true)}
            className="bg-black text-white"
          >
            Borrow Book
          </Button>
          <Button onClick={() => setShowReturnModal(true)} variant="outline">
            Return Book
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {borrowRecords
          .filter((record) => record.status !== "returned")
          .slice(-7)
          .map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-gray-900 mr-2">
                  {record.bookTitle || "Unknown Book"}
                </span>
                {statusBadge(record.status)}
              </div>
              <div className="text-gray-600 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="font-medium">
                    {record.memberName || "Unknown Member"}
                  </span>
                </span>
              </div>
              <div className="flex gap-8 text-gray-700 text-sm mt-2">
                <span>Borrowed: {record.borrowDate}</span>
                <span>Due: {record.dueDate}</span>
                {record.returnDate && (
                  <span>Returned: {record.returnDate}</span>
                )}
              </div>
              {record.status === "borrowed" && (
                <Button
                  className="mt-4 w-max"
                  onClick={() => handleMarkReturned(record.id)}
                >
                  Mark as Returned
                </Button>
              )}
            </div>
          ))}
      </div>

      <Modal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        title="Borrow Book"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={borrowForm.bookId}
              onChange={(e) =>
                setBorrowForm((f) => ({ ...f, bookId: e.target.value }))
              }
            >
              <option value="">Choose a book to borrow</option>
              {books.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Member
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={borrowForm.memberId}
              onChange={(e) =>
                setBorrowForm((f) => ({
                  ...f,
                  memberId: e.target.value,
                }))
              }
            >
              <option value="">Choose a member</option>
              {members.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={borrowForm.dueDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setBorrowForm((f) => ({
                  ...f,
                  dueDate: new Date(e.target.value),
                }))
              }
            />
          </div>
          {borrowError && (
            <div className="text-red-600 text-sm">{borrowError}</div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBorrowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBorrow}>Borrow Book</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Return Book"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book to Return
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={returnForm.borrowId}
              onChange={(e) =>
                setReturnForm((f) => ({ ...f, borrowId: e.target.value }))
              }
            >
              <option value="">Choose a book to return</option>
              {borrowRecords
                .filter((r) => r.status === "borrowed")
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.bookTitle || "Unknown Book"} (by{" "}
                    {r.memberName || "Unknown Member"})
                  </option>
                ))}
            </select>
          </div>

          {returnError && (
            <div className="text-red-600 text-sm">{returnError}</div>
          )}
          {returnSuccess && (
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
                  <p className="text-sm text-green-700">{returnSuccess}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowReturnModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturn}>Return Book</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
