"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const recoil_1 = require("recoil");
const react_router_dom_1 = require("react-router-dom");
const Routing_1 = require("@frontend/components/common/Routing");
const Layout_1 = require("@frontend/components/common/Layout");
const Utils_1 = require("@frontend/components/common/Utils");
const Document = () => {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(recoil_1.RecoilRoot, { children: [(0, jsx_runtime_1.jsx)(Utils_1.Utils, {}), (0, jsx_runtime_1.jsx)(Layout_1.Layout, { children: (0, jsx_runtime_1.jsx)(Routing_1.RoutingContent, {}) })] }) }));
};
exports.Document = Document;
