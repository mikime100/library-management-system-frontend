import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
const Textarea = forwardRef(({ className = '', label, error, fullWidth = false, rows = 3, ...props }, ref) => {
    const baseStyles = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
    const errorStyles = 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500';
    const normalStyles = 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    const textareaClasses = [
        baseStyles,
        error ? errorStyles : normalStyles,
        fullWidth ? 'w-full' : '',
        className,
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: fullWidth ? 'w-full' : '', children: [label && (_jsxs("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700 mb-1", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("div", { className: "relative rounded-md shadow-sm", children: _jsx("textarea", { ref: ref, className: textareaClasses, rows: rows, ...props }) }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error }))] }));
});
Textarea.displayName = 'Textarea';
export default Textarea;
