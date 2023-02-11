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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.鉢作成モーダル = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_hook_form_1 = require("react-hook-form");
const action_1 = require("@frontend/store/auth/action");
const ui_1 = require("@frontend/supports/ui");
const UploadImage_1 = require("@frontend/components/atoms/UploadImage");
const item_1 = require("@frontend/domain/model/item");
const MyInputWithAlert_1 = require("@frontend/components/atoms/MyInputWithAlert");
const DEFAULT_VALUES = {
    name: undefined,
    imageDataUrl: undefined,
    科: undefined,
    属: undefined,
    種名: undefined,
    補足: undefined,
};
exports.鉢作成モーダル = (0, react_1.forwardRef)((props, ref) => {
    const { 棚Id } = props;
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { isLoading, withLoading } = (0, ui_1.useWithLoading)();
    const { user } = (0, action_1.useAuthState)();
    const { control, getValues, formState } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: DEFAULT_VALUES,
    });
    const maxLength = { value: 40, message: '最大40文字までです。' };
    const imageDataUrl = (0, react_hook_form_1.useController)({
        control,
        name: 'imageDataUrl',
        rules: { required: '必須です。' },
    });
    const name = (0, react_hook_form_1.useController)({
        control,
        name: 'name',
        rules: { maxLength },
    });
    const [科, 属, 種名, 補足] = ['科', '属', '種名', '補足'].map(key => {
        return (0, react_hook_form_1.useController)({
            control,
            name: key,
            rules: { maxLength },
        });
    });
    const modalProps = {
        open: isOpen,
        onCancel: () => setIsOpen(false),
        onOk: () => 鉢の作成を実行する(),
        okButtonProps: {
            disabled: !formState.isValid,
        },
        okText: '作成',
        cancelText: 'キャンセル',
        confirmLoading: isLoading,
    };
    const 鉢の作成を実行する = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!user)
            return;
        yield withLoading(() => __awaiter(void 0, void 0, void 0, function* () {
            const _a = getValues(), { imageDataUrl, name } = _a, 詳細 = __rest(_a, ["imageDataUrl", "name"]);
            console.warn({ getValues: getValues() });
            if (!棚Id || !imageDataUrl)
                return;
            yield item_1.鉢.管理.新規作成({
                imageDataUrl,
                props: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    name,
                    詳細,
                    棚Id,
                },
            });
            setIsOpen(false);
        }));
    });
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            open: () => setIsOpen(true),
        };
    });
    return ((0, jsx_runtime_1.jsxs)(antd_1.Modal, Object.assign({}, modalProps, { className: "\u9262\u3092\u4F5C\u6210\u30E2\u30FC\u30C0\u30EB" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "\u9262\u3092\u4F5C\u6210" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "FormItem" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "\u753B\u50CF\u3092\u64AE\u5F71\uD83D\uDCF8" }), (0, jsx_runtime_1.jsx)(UploadImage_1.UploadImage, { field: imageDataUrl.field })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "FormItem" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "\u9262\u306E\u540D\u524D" }), (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: name, inputProps: { placeholder: '鉢の名前' } })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "FormItem" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "\u8A73\u7D30\u306A\u60C5\u5831" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: 科, inputProps: { placeholder: '科' } }), (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: 属, inputProps: { placeholder: '属' } }), (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: 種名, inputProps: { placeholder: '種名' } }), (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: 補足, inputProps: { placeholder: '補足' } })] })] }))] })));
});
