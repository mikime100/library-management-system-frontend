import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  widthClass?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  widthClass = "max-w-lg",
  children,
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 z-40" />
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${widthClass} mx-4 relative animate-fadeIn max-h-[90vh] flex flex-col z-50`}
        style={{ overflow: "hidden" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        {title && (
          <h2 className="text-2xl font-bold mb-2 pt-6 px-6">{title}</h2>
        )}
        <div
          className="px-6 pb-6 pt-2 overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
