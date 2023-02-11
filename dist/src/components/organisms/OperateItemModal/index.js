"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.鉢管理モーダル = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@frontend/supports/ui");
const action_1 = require("@frontend/store/auth/action");
const antd_1 = require("antd");
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const ReplantOperationModal_1 = require("@frontend/components/organisms/ReplantOperationModal");
exports.鉢管理モーダル = (0, react_1.forwardRef)((props, ref) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { isLoading, withLoading } = (0, ui_1.useWithLoading)();
    const [item, setItem] = (0, react_1.useState)(null);
    const { user } = (0, action_1.useAuthState)();
    const 植替え操作モーダルRef = (0, react_1.useRef)(null);
    const modalProps = {
        className: '鉢管理モーダル',
        open: isOpen,
        onCancel: () => setIsOpen(false),
        // onOk: () => 棚の作成を実行する(),
        okButtonProps: {
        // disabled: !isValid,
        },
        okText: '作成',
        cancelText: '閉じる',
        confirmLoading: isLoading,
        destroyOnClose: true,
    };
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            open: (鉢) => {
                setItem(鉢);
                console.log(鉢);
                setIsOpen(true);
            },
        };
    });
    const 灌水モーダルを開く = () => { };
    const 植替えモーダルを開く = () => {
        var _a;
        if (!item)
            return;
        (_a = 植替え操作モーダルRef.current) === null || _a === void 0 ? void 0 : _a.open(item);
    };
    return ((0, jsx_runtime_1.jsxs)(antd_1.Modal, Object.assign({}, modalProps, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "\u9262\u306E\u304A\u624B\u5165\u308C" }), "\u9262\u540D: ", item === null || item === void 0 ? void 0 : item.name, (0, jsx_runtime_1.jsx)("h2", { children: "\u7BA1\u7406" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "\u7BA1\u7406\u30DC\u30BF\u30F3" }, { children: [(0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { title: '灌水', onClick: 灌水モーダルを開く }), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { title: '植替え', onClick: 植替えモーダルを開く })] })), (0, jsx_runtime_1.jsx)(ReplantOperationModal_1.植替え操作モーダル, { ref: 植替え操作モーダルRef })] })));
});
