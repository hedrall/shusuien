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
exports.InputPasswordStep = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const antd_1 = require("antd");
const InputGroup = antd_1.Input.Group;
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const MyAlert_1 = require("@frontend/components/atoms/MyAlert");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const PasswordInput_1 = require("@frontend/components/atoms/PasswordInput");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("@frontend/domain/repository/auth");
const routes_1 = require("@frontend/settings/routes");
const InputPasswordStep = props => {
    var _a, _b;
    const { email } = props;
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { control, getValues, setError, formState } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email,
            password: '',
            result: false,
        },
    });
    const emailCntr = (0, react_hook_form_1.useController)({ control, name: 'email' });
    const passwordCntr = (0, react_hook_form_1.useController)({
        control,
        name: 'password',
        rules: { required: true },
    });
    const login = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!formState.isValid)
            return;
        const { password } = getValues();
        setIsLoading(true);
        try {
            // sign in
            yield auth_1.AuthRepository.signIn.withEmail(email, password);
            navigate(routes_1.ROUTES.TOP.PATH);
        }
        catch (e) {
            if ('code' in e) {
                console.log(e.code);
                if (e.code === 'auth/wrong-password') {
                    setError('result', {
                        message: 'ログインに失敗しました。メールアドレス、またはパスワードを確認してください。',
                    });
                }
            }
        }
        finally {
            setIsLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Step InputPasswordStep" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Form" }, { children: (0, jsx_runtime_1.jsxs)(InputGroup, { children: [(0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { controller: emailCntr, readOnly: true }), (0, jsx_runtime_1.jsx)(PasswordInput_1.PasswordInput, { controller: passwordCntr, autoFocus: true })] }) })), (0, jsx_runtime_1.jsx)(MyAlert_1.MyAlert, { active: !!((_a = formState.errors.result) === null || _a === void 0 ? void 0 : _a.message), title: (_b = formState.errors.result) === null || _b === void 0 ? void 0 : _b.message }), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { active: formState.isValid && !isLoading, onClick: login, title: "\u30ED\u30B0\u30A4\u30F3", isLoading: isLoading })] })));
};
exports.InputPasswordStep = InputPasswordStep;
