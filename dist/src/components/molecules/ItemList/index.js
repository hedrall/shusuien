"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.鉢一覧 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const CreateItemModal_1 = require("@frontend/components/organisms/CreateItemModal");
const action_1 = require("@frontend/store/data/action");
const action_2 = require("@frontend/store/auth/action");
const ItemListCell_1 = require("@frontend/components/atoms/ItemListCell");
const OperateItemModal_1 = require("@frontend/components/organisms/OperateItemModal");
const { Panel } = antd_1.Collapse;
const ListItem = props => {
    const { 鉢, 鉢を選択 } = props;
    return ((0, jsx_runtime_1.jsx)(antd_1.Col, Object.assign({ lg: 2, sm: 4, xs: 6 }, { children: (0, jsx_runtime_1.jsx)(ItemListCell_1.鉢一覧の要素, { item: 鉢, "\u9262\u3092\u9078\u629E": 鉢を選択 }) })));
};
const 鉢一覧 = props => {
    const { 棚 } = props;
    const 鉢操作モーダルRef = (0, react_1.useRef)(null);
    const 鉢管理モーダルRef = (0, react_1.useRef)(null);
    const { user } = (0, action_2.useAuthState)();
    const 棚Id = 棚.id;
    const { 鉢一覧, 鉢を購読 } = (0, action_1.use鉢)(棚Id);
    (0, react_1.useEffect)(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        const { unsubscribe } = 鉢を購読(user.id, 棚Id);
        return () => unsubscribe();
    }, [user === null || user === void 0 ? void 0 : user.id, 棚Id]);
    const 鉢作成モーダルを開く = () => { var _a; return (_a = 鉢操作モーダルRef.current) === null || _a === void 0 ? void 0 : _a.open(); };
    const 鉢を選択 = (鉢) => {
        var _a;
        (_a = 鉢管理モーダルRef.current) === null || _a === void 0 ? void 0 : _a.open(鉢);
    };
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "\u9262\u4E00\u89A7" }, { children: [(0, jsx_runtime_1.jsx)(antd_1.Row, Object.assign({ gutter: { xs: 8, sm: 16, md: 24, lg: 32 } }, { children: 鉢一覧.map(鉢 => {
                    return (0, jsx_runtime_1.jsx)(ListItem, { "\u9262": 鉢, "\u9262\u3092\u9078\u629E": 鉢を選択 }, 鉢.id);
                }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Section" }, { children: (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { title: '⨁ 鉢を追加する', onClick: 鉢作成モーダルを開く }) })), (0, jsx_runtime_1.jsx)(CreateItemModal_1.鉢作成モーダル, { ref: 鉢操作モーダルRef, "\u68DAId": 棚Id }), (0, jsx_runtime_1.jsx)(OperateItemModal_1.鉢管理モーダル, { ref: 鉢管理モーダルRef })] })));
};
exports.鉢一覧 = 鉢一覧;
