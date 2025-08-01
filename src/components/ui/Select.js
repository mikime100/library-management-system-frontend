import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
const Select = forwardRef(({ className = '', label, error, icon: Icon, fullWidth = false, children, options, ...props }, ref) => {
    const baseStyles = 'appearance-none block w-full pl-3 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm';
    const errorStyles = 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500';
    const normalStyles = 'border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500';
    const selectClasses = [
        baseStyles,
        error ? errorStyles : normalStyles,
        fullWidth ? 'w-full' : '',
        Icon ? 'pl-10' : '',
        className,
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: fullWidth ? 'w-full' : '', children: [label && (_jsxs("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700 mb-1", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "relative rounded-md shadow-sm", children: [Icon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Icon, { className: "h-4 w-4 text-gray-400" }) })), _jsx("select", { ref: ref, className: selectClasses, ...props, children: options ? (options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))) : (children) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700", children: _jsx("svg", { className: "h-4 w-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error }))] }));
});
Select.displayName = 'Select';
export default Select;
