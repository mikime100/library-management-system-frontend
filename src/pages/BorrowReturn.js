import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useBorrowReturnStore } from "@/store/borrowReturnStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
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
    const { borrowRecords, fetchBorrowRecords, borrowBook, returnBook, loading, error, } = useBorrowReturnStore();
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
        const book = books.find((b) => b.id === borrowForm.bookId);
        const member = members.find((m) => m.id === borrowForm.memberId);
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
        }
        else {
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
        }
        else {
            setReturnError("Failed to return book.");
        }
    };
    const handleMarkReturned = async (borrowId) => {
        await returnBook(borrowId);
        fetchBorrowRecords();
    };
    const statusBadge = (status) => {
        if (status === "overdue")
            return (_jsx("span", { className: "bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: "OVERDUE" }));
        if (status === "returned")
            return (_jsx("span", { className: "bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold", children: "RETURNED" }));
        return (_jsx("span", { className: "bg-black text-white px-3 py-1 rounded-full text-xs font-bold", children: "ACTIVE" }));
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-extrabold text-gray-900 mb-1", children: "Borrow & Return" }), _jsx("p", { className: "text-gray-500 text-base", children: "Manage book borrowing and return operations" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setShowBorrowModal(true), className: "bg-black text-white", children: "Borrow Book" }), _jsx(Button, { onClick: () => setShowReturnModal(true), variant: "outline", children: "Return Book" })] })] }), _jsx("div", { className: "space-y-6", children: borrowRecords
                    .filter((record) => record.status !== "returned")
                    .slice(-7)
                    .map((record) => (_jsxs("div", { className: "bg-white rounded-xl shadow p-6 flex flex-col gap-2 relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-xl font-bold text-gray-900 mr-2", children: record.bookTitle || "Unknown Book" }), statusBadge(record.status)] }), _jsx("div", { className: "text-gray-600 flex items-center gap-4", children: _jsx("span", { className: "flex items-center gap-1", children: _jsx("span", { className: "font-medium", children: record.memberName || "Unknown Member" }) }) }), _jsxs("div", { className: "flex gap-8 text-gray-700 text-sm mt-2", children: [_jsxs("span", { children: ["Borrowed: ", record.borrowDate] }), _jsxs("span", { children: ["Due: ", record.dueDate] }), record.returnDate && (_jsxs("span", { children: ["Returned: ", record.returnDate] }))] }), record.status === "borrowed" && (_jsx(Button, { className: "mt-4 w-max", onClick: () => handleMarkReturned(record.id), children: "Mark as Returned" }))] }, record.id))) }), _jsx(Modal, { isOpen: showBorrowModal, onClose: () => setShowBorrowModal(false), title: "Borrow Book", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Book" }), _jsxs("select", { className: "w-full border rounded px-3 py-2", value: borrowForm.bookId, onChange: (e) => setBorrowForm((f) => ({ ...f, bookId: e.target.value })), children: [_jsx("option", { value: "", children: "Choose a book to borrow" }), books.map((b) => (_jsx("option", { value: b.id, children: b.title }, b.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Member" }), _jsxs("select", { className: "w-full border rounded px-3 py-2", value: borrowForm.memberId, onChange: (e) => setBorrowForm((f) => ({
                                        ...f,
                                        memberId: e.target.value,
                                    })), children: [_jsx("option", { value: "", children: "Choose a member" }), members.map((m) => (_jsx("option", { value: m.id, children: m.name }, m.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Due Date" }), _jsx(Input, { type: "date", value: borrowForm.dueDate.toISOString().split("T")[0], onChange: (e) => setBorrowForm((f) => ({
                                        ...f,
                                        dueDate: new Date(e.target.value),
                                    })) })] }), borrowError && (_jsx("div", { className: "text-red-600 text-sm", children: borrowError })), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Button, { variant: "outline", onClick: () => setShowBorrowModal(false), children: "Cancel" }), _jsx(Button, { onClick: handleBorrow, children: "Borrow Book" })] })] }) }), _jsx(Modal, { isOpen: showReturnModal, onClose: () => setShowReturnModal(false), title: "Return Book", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Book to Return" }), _jsxs("select", { className: "w-full border rounded px-3 py-2", value: returnForm.borrowId, onChange: (e) => setReturnForm((f) => ({ ...f, borrowId: e.target.value })), children: [_jsx("option", { value: "", children: "Choose a book to return" }), borrowRecords
                                            .filter((r) => r.status === "borrowed")
                                            .map((r) => (_jsxs("option", { value: r.id, children: [r.bookTitle || "Unknown Book", " (by", " ", r.memberName || "Unknown Member", ")"] }, r.id)))] })] }), returnError && (_jsx("div", { className: "text-red-600 text-sm", children: returnError })), returnSuccess && (_jsx("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 mb-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-green-700", children: returnSuccess }) })] }) })), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Button, { variant: "outline", onClick: () => setShowReturnModal(false), children: "Cancel" }), _jsx(Button, { onClick: handleReturn, children: "Return Book" })] })] }) })] }));
}
