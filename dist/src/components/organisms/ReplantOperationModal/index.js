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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.植替え操作モーダル = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@frontend/supports/ui");
const action_1 = require("@frontend/store/auth/action");
const antd_1 = require("antd");
const item_1 = require("@frontend/domain/model/item");
const history_1 = require("@frontend/domain/model/history");
const dayjs_1 = __importDefault(require("dayjs"));
const react_hook_form_1 = require("react-hook-form");
const MyInputWithAlert_1 = require("@frontend/components/atoms/MyInputWithAlert");
const RadioGroup_1 = require("@frontend/components/atoms/RadioGroup");
const MySwitch_1 = require("@frontend/components/atoms/MySwitch");
const MyForm_1 = require("@frontend/components/molecules/MyForm");
const UploadImage_1 = require("@frontend/components/atoms/UploadImage");
const DATE_FORMAT = 'YYYY/DD/MM HH:mm:ss';
const DEFAULT_VALUES = {
    size: '3',
    isLong: false,
    imageDataUrl: undefined,
    date: (0, dayjs_1.default)().format(DATE_FORMAT),
    memo: undefined,
};
const maxLength = { value: 400, message: '最大400文字までです。' };
const createController = (control) => {
    const size = (0, react_hook_form_1.useController)({
        control,
        name: 'size',
        rules: { required: true },
    });
    const isLong = (0, react_hook_form_1.useController)({
        control,
        name: 'isLong',
    });
    const imageDataUrl = (0, react_hook_form_1.useController)({
        control,
        name: 'imageDataUrl',
        rules: { required: '必須です。' },
    });
    const date = (0, react_hook_form_1.useController)({
        control,
        name: 'date',
        rules: { required: '必須です。' },
    });
    const memo = (0, react_hook_form_1.useController)({
        control,
        name: 'memo',
        rules: { maxLength },
    });
    return { size, isLong, imageDataUrl, date, memo };
};
const 鉢サイズの選択肢 = history_1.鉢サイズ.番号.map(num => {
    return {
        name: `${num}号`,
        value: num,
    };
});
exports.植替え操作モーダル = (0, react_1.forwardRef)((props, ref) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { isLoading, withLoading } = (0, ui_1.useWithLoading)();
    const [item, setItem] = (0, react_1.useState)(null);
    const { user } = (0, action_1.useAuthState)();
    const { control, getValues, formState } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: DEFAULT_VALUES,
    });
    const { size, isLong, imageDataUrl, date, memo } = createController(control);
    const 植替えを実行する = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!user || !item)
            return;
        yield withLoading(() => __awaiter(void 0, void 0, void 0, function* () {
            const { imageDataUrl, size, isLong, date, memo } = getValues();
            console.log({ v: getValues() });
            yield item_1.鉢.管理.植替え({
                imageDataUrl,
                userId: user.id,
                item,
                date: (0, dayjs_1.default)(date),
                鉢のサイズ: {
                    番号: size,
                    タイプ: isLong ? 'L' : '',
                },
                memo,
            });
            setIsOpen(false);
        }));
    });
    const modalProps = {
        className: '植替え操作モーダル',
        open: isOpen,
        onCancel: () => setIsOpen(false),
        onOk: () => 植替えを実行する(),
        okButtonProps: {
            disabled: !formState.isValid,
        },
        okText: '植替えを記録する',
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
    return ((0, jsx_runtime_1.jsxs)(antd_1.Modal, Object.assign({}, modalProps, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "\u690D\u66FF\u3048\u3092\u8A18\u9332" }), "\u9262\u540D: ", item === null || item === void 0 ? void 0 : item.name, (0, jsx_runtime_1.jsx)(MyForm_1.MyFormLayout, { items: [
                    {
                        label: '植替え日時',
                        input: (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: date, inputProps: { readOnly: true } }),
                    },
                    {
                        label: '植替え後の画像を撮影📸',
                        input: (0, jsx_runtime_1.jsx)(UploadImage_1.UploadImage, { field: imageDataUrl.field }),
                    },
                    {
                        label: '鉢のサイズ',
                        input: (0, jsx_runtime_1.jsx)(RadioGroup_1.RadioGroup, { field: size.field, options: 鉢サイズの選択肢 }),
                    },
                    {
                        label: 'ロングポット',
                        input: (0, jsx_runtime_1.jsx)(MySwitch_1.MySwitch, { field: isLong.field }),
                        type: 'oneLine',
                        align: 'right',
                    },
                    {
                        label: 'メモ (任意)',
                        input: (0, jsx_runtime_1.jsx)(MyInputWithAlert_1.MyInputWithAlert, { controller: memo }),
                    },
                ] })] })));
});
