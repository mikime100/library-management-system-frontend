import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function StatCard({ title, value, icon: Icon, trend = 'neutral', trendValue, trendLabel, }) {
    const trendColors = {
        up: 'text-green-600 bg-green-50',
        down: 'text-red-600 bg-red-50',
        neutral: 'text-gray-600 bg-gray-50',
    };
    const trendIcons = {
        up: (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) })),
        down: (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })),
        neutral: (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16m-7 6h7" }) })),
    };
    return (_jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Icon, { className: "h-6 w-6 text-gray-400", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: title }), _jsx("dd", { children: _jsx("div", { className: "text-lg font-medium text-gray-900", children: value }) })] }) })] }) }), trend !== 'neutral' && trendValue && (_jsx("div", { className: "px-5 py-3 bg-gray-50", children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trendColors[trend]}`, children: [trendIcons[trend], _jsx("span", { className: "ml-1", children: trendValue })] }), _jsx("span", { className: "text-gray-500 ml-2", children: trendLabel })] }) }))] }));
}
