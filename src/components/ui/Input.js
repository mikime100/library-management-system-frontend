import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
const Input = forwardRef(({ className = "", label, error, fullWidth = false, icon, ...props }, ref) => {
    const baseStyles = "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-[35px] py-2 px-3";
    const errorStyles = "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500";
    const normalStyles = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
    const inputClasses = [
        baseStyles,
        error ? errorStyles : normalStyles,
        fullWidth ? "w-full" : "",
        icon ? "pl-10" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: fullWidth ? "w-full" : "", children: [label && (_jsxs("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700 mb-1", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "relative rounded-md shadow-sm", children: [icon && (_jsx("span", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: icon })), _jsx("input", { ref: ref, className: inputClasses, ...props })] }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", id: "email-error", children: error }))] }));
});
Input.displayName = "Input";
export default Input;
