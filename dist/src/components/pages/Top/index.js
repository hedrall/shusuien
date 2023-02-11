"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CreateTanaModal_1 = require("@frontend/components/organisms/CreateTanaModal");
const action_1 = require("@frontend/store/auth/action");
const react_router_dom_1 = require("react-router-dom");
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const routes_1 = require("@frontend/settings/routes");
const action_2 = require("@frontend/store/data/action");
const TanaList_1 = require("@frontend/components/organisms/TanaList");
const TopPage = props => {
    const { user } = (0, action_1.useAuthState)();
    const { 棚を購読, 棚一覧 } = (0, action_2.useDataState)();
    (0, react_1.useEffect)(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        const { unsubscribe } = 棚を購読(user.id);
        return () => unsubscribe();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    const navigator = (0, react_router_dom_1.useNavigate)();
    const 棚作成モーダルのRef = (0, react_1.useRef)(null);
    const 棚作成モーダルを開く = () => {
        var _a;
        (_a = 棚作成モーダルのRef.current) === null || _a === void 0 ? void 0 : _a.open();
    };
    if (!user) {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Top" }, { children: (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { title: 'ログインページへ', onClick: () => navigator(routes_1.ROUTES.LOGIN.PATH) }) })));
    }
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Top" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "topPage " }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Section" }, { children: (0, jsx_runtime_1.jsx)(TanaList_1.棚一覧表示, { "\u68DA\u4E00\u89A7": 棚一覧 }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Section" }, { children: (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { title: '⨁ 棚を作成する', onClick: 棚作成モーダルを開く }) })), (0, jsx_runtime_1.jsx)(CreateTanaModal_1.棚作成モーダル, { ref: 棚作成モーダルのRef })] })));
};
exports.TopPage = TopPage;
