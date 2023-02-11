"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.棚作成モーダル = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_hook_form_1 = require("react-hook-form");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const action_1 = require("@frontend/store/auth/action");
const ui_1 = require("@frontend/supports/ui");
const tana_1 = require("@frontend/domain/model/tana");
exports.棚作成モーダル = (0, react_1.forwardRef)((props, ref) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { isLoading, withLoading } = (0, ui_1.useWithLoading)();
    const { user } = (0, action_1.useAuthState)();
    const { control, getValues } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
        },
    });
    const name = (0, react_hook_form_1.useController)({
        control,
        name: 'name',
        rules: { required: '必須です。' },
    });
    const isValid = !!getValues().name;
    const modalProps = {
        open: isOpen,
        onCancel: () => setIsOpen(false),
        onOk: () => 棚の作成を実行する(),
        okButtonProps: {
            disabled: !isValid,
        },
        okText: '作成',
        cancelText: 'キャンセル',
        confirmLoading: isLoading,
    };
    const 棚の作成を実行する = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!user)
            return;
        yield withLoading(() => __awaiter(void 0, void 0, void 0, function* () {
            yield tana_1.棚.新規作成({ name: getValues().name, userId: user === null || user === void 0 ? void 0 : user.id });
        }));
        setIsOpen(false);
    });
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            open: () => setIsOpen(true),
        };
    });
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "\u68DA\u3092\u4F5C\u6210\u30E2\u30FC\u30C0\u30EB" }, { children: (0, jsx_runtime_1.jsxs)(antd_1.Modal, Object.assign({}, modalProps, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "\u68DA\u3092\u4F5C\u6210" }), (0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { controller: name, placeholder: "\u68DA\u306E\u540D\u524D", autoFocus: true })] })) })));
});
