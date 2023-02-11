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
exports.NoAccountStep = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const antd_1 = require("antd");
const InputGroup = antd_1.Input.Group;
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const NoAccountStep = props => {
    const { setStep, email } = props;
    const { control } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email,
            result: false,
        },
    });
    const controller = (0, react_hook_form_1.useController)({
        control,
        name: 'email',
        rules: { required: '必須です。' },
    });
    const createNewAccount = () => __awaiter(void 0, void 0, void 0, function* () {
        setStep('registerNewAccount', email);
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Step NoAccountStep" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "EmailPasswordSignIn" }, { children: (0, jsx_runtime_1.jsx)(InputGroup, { children: (0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { controller: controller, readOnly: true }) }) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Desc" }, { children: ["\u5165\u529B\u3055\u308C\u305F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002 ", (0, jsx_runtime_1.jsx)("br", {}), "\u65B0\u898F\u306E\u30E6\u30FC\u30B6\u767B\u9332\u3092\u884C\u3044\u307E\u3059\u304B\uFF1F"] })), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { autoFocus: true, onClick: createNewAccount, title: "\u7D9A\u884C" })] })));
};
exports.NoAccountStep = NoAccountStep;
