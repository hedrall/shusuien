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
exports.RegisterNewAccountStep = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const antd_1 = require("antd");
const InputGroup = antd_1.Input.Group;
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const MyAlert_1 = require("@frontend/components/atoms/MyAlert");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const PasswordInput_1 = require("@frontend/components/atoms/PasswordInput");
const action_1 = require("@frontend/store/auth/action");
const auth_1 = require("@frontend/domain/repository/auth");
const RegisterNewAccountStep = props => {
    var _a, _b;
    const { setStep, email } = props;
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { setUser } = (0, action_1.useAuthState)();
    const { control, getValues, setError, formState } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email,
            password1: '',
            password2: '',
            result: false,
        },
    });
    const emailCntr = (0, react_hook_form_1.useController)({ control, name: 'email' });
    const p1lCntr = (0, react_hook_form_1.useController)({
        control,
        name: 'password1',
        rules: { required: true },
    });
    const p2lCntr = (0, react_hook_form_1.useController)({
        control,
        name: 'password2',
        rules: { required: true },
    });
    const create = () => __awaiter(void 0, void 0, void 0, function* () {
        const { password1, password2 } = getValues();
        if (password1 !== password2) {
            setError('result', { message: 'パスワードが一致しません。' });
        }
        setIsLoading(true);
        try {
            // create new account
            const newUser = yield auth_1.AuthRepository.createAccount.withEmail(email, password1);
            setUser(newUser);
            setStep('setUserName', '');
        }
        catch (e) {
            if ('code' in e) {
                console.log(e.code);
                const error = e;
                if (error.code === 'auth/weak-password') {
                    setError('result', {
                        message: 'パスワードの強度が足りません。もう少し長いパスワードや、英数記号を織り交ぜるなどを試してください。',
                    });
                }
            }
        }
        finally {
            setIsLoading(true);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Step NoAccountStep" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(InputGroup, { children: (0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { controller: emailCntr, readOnly: true }) }) }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Desc" }, { children: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "PasswordSettingForm" }, { children: (0, jsx_runtime_1.jsxs)(InputGroup, { children: [(0, jsx_runtime_1.jsx)(PasswordInput_1.PasswordInput, { controller: p1lCntr, placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9", autoFocus: true }), (0, jsx_runtime_1.jsx)(PasswordInput_1.PasswordInput, { controller: p2lCntr, placeholder: "\u78BA\u8A8D\u306E\u305F\u3081\u3082\u3046\u4E00\u5EA6\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })] }) })), (0, jsx_runtime_1.jsx)(MyAlert_1.MyAlert, { active: !!((_a = formState.errors.result) === null || _a === void 0 ? void 0 : _a.message), title: (_b = formState.errors.result) === null || _b === void 0 ? void 0 : _b.message }), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { active: formState.isValid && !isLoading, onClick: create, title: "\u767B\u9332", isLoading: isLoading })] })));
};
exports.RegisterNewAccountStep = RegisterNewAccountStep;
