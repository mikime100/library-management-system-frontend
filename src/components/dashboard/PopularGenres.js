import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen } from 'lucide-react';
export default function PopularGenres({ genres }) {
    // Sort genres by count in descending order and take top 5
    const topGenres = [...genres]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    // Calculate the maximum count for percentage calculation
    const maxCount = topGenres[0]?.count || 1;
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Popular Genres" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Most borrowed genres this month" })] }), _jsx("div", { className: "px-4 py-5 sm:p-6", children: topGenres.length > 0 ? (_jsx("div", { className: "space-y-4", children: topGenres.map((genre) => {
                        const percentage = (genre.count / maxCount) * 100;
                        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: genre.name }), _jsxs("span", { className: "text-xs font-medium text-gray-500", children: [genre.count, " ", genre.count === 1 ? 'book' : 'books'] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-indigo-600 h-2 rounded-full", style: { width: `${percentage}%` } }) })] }, genre.name));
                    }) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100", children: _jsx(BookOpen, { className: "h-6 w-6 text-gray-400" }) }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No genre data" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "No borrowing data available for genres." })] })) })] }));
}
