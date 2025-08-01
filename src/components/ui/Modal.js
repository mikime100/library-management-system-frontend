import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
export default function Modal({ isOpen, onClose, title, widthClass = "max-w-lg", children, }) {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black/50 z-40" }), _jsxs("div", { className: `bg-white rounded-2xl shadow-2xl w-full ${widthClass} mx-4 relative animate-fadeIn max-h-[90vh] flex flex-col z-50`, style: { overflow: "hidden" }, children: [_jsx("button", { className: "absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl", onClick: onClose, "aria-label": "Close modal", children: _jsx(X, { className: "h-6 w-6" }) }), title && (_jsx("h2", { className: "text-2xl font-bold mb-2 pt-6 px-6", children: title })), _jsx("div", { className: "px-6 pb-6 pt-2 overflow-y-auto", style: { maxHeight: "70vh" }, children: children })] })] }));
}
