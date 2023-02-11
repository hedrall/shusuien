"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const action_1 = require("@frontend/store/auth/action");
const react_router_dom_1 = require("react-router-dom");
const routes_1 = require("@frontend/settings/routes");
const icons_1 = require("@ant-design/icons");
const auth_1 = require("@frontend/domain/repository/auth");
const Layout = ({ children }) => {
    const { user } = (0, action_1.useAuthState)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const signOut = auth_1.AuthRepository.signOut;
    (0, react_1.useEffect)(() => {
        if (location.pathname === routes_1.ROUTES.LOGIN.PATH && user) {
            const params = new URLSearchParams(location.search);
            const from = params.get('from');
            const to = from ? decodeURIComponent(from) : routes_1.ROUTES.TOP.PATH;
            console.log('ログイン済みのため、元のURLへ返します');
            console.log({ user });
            navigate(to);
            return;
        }
        if (location.pathname !== routes_1.ROUTES.LOGIN.PATH && !user) {
            console.log('未ログイン状態のため、LOGINへ遷移します');
            const from = encodeURIComponent(location.pathname + location.search);
            navigate(routes_1.ROUTES.LOGIN.PATH + `?from=${from}`);
        }
    }, [user === null || user === void 0 ? void 0 : user.id]);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Layout" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Header" }, { children: ["\u8DA3\u6C34\u5712", user && (0, jsx_runtime_1.jsx)(icons_1.LogoutOutlined, { onClick: signOut })] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Main" }, { children: children })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Footer" }, { children: "Created by Hedrall" }))] })));
};
exports.Layout = Layout;
