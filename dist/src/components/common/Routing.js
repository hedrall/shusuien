"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingContent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const routes_1 = require("@frontend/settings/routes");
const routes = Object.values(routes_1.ROUTES);
const RoutingContent = () => {
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [routes.map(({ PATH, COMPONENT }) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: PATH, element: (0, jsx_runtime_1.jsx)(COMPONENT, {}) }, PATH))), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: '/error' }) })] }) }));
};
exports.RoutingContent = RoutingContent;
