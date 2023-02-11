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
exports.FirstStep = exports.isValidEmail = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const antd_1 = require("antd");
const InputGroup = antd_1.Input.Group;
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const MyAlert_1 = require("@frontend/components/atoms/MyAlert");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const action_1 = require("@frontend/store/auth/action");
const react_router_dom_1 = require("react-router-dom");
const user_1 = require("@frontend/domain/model/user");
const auth_1 = require("@frontend/domain/repository/auth");
const routes_1 = require("@frontend/settings/routes");
const firestore_1 = require("@frontend/domain/repository/firestore");
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
const isValidEmail = (email) => 
// eslint-disable-next-line no-useless-escape
/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
exports.isValidEmail = isValidEmail;
function GoogleLoginButton(props) {
    return ((0, jsx_runtime_1.jsx)(antd_1.Button, Object.assign({ onClick: props.onClick }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "GoogleSignInButtonContent" }, { children: [(0, jsx_runtime_1.jsx)("img", { className: "GoogleIcon", src: "/images/googleIcon.svg" }), "Google\u30ED\u30B0\u30A4\u30F3"] })) })));
}
const FirstStep = props => {
    var _a, _b;
    const { setStep } = props;
    const { control, getValues, formState, setError } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            result: false,
        },
    });
    const { setUser } = (0, action_1.useAuthState)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const email = (0, react_hook_form_1.useController)({
        control,
        name: 'email',
        rules: { required: '必須です。' },
    });
    const signInWithEmail = () => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = getValues();
        if (!(0, exports.isValidEmail)(email)) {
            setError('result', { message: 'emailの形式が不正です。' });
            return;
        }
        try {
            const result = yield auth_1.AuthRepository.get.signInMethodForEmail(email);
            switch (result) {
                case 'no-account':
                    setStep('noAccount', email);
                    return;
                case 'registered-with-google':
                    setError('result', { message: 'Googleアカウントにて登録されています。' });
                    return;
                case 'with-email':
                default:
                    // can sign in with password
                    setStep('inputPassword', email);
            }
        }
        catch (e) {
            const isAuthError = (e) => 'name' in e && e.name === 'FirebaseError';
            if (!isAuthError(e))
                return;
            const { code } = e;
            console.log({ code });
        }
    });
    const signInWithGoogle = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dbUser, uid } = yield auth_1.AuthRepository.signIn.withGoogle();
            if (dbUser) {
                setUser(dbUser);
                navigate(routes_1.ROUTES.TOP.PATH);
                return;
            }
            // create new user to firestore
            yield firestore_1.FSAppRepository.addItemWithId(new app_1.FsAppManager.User(), user_1.User.createDefault(uid));
            setStep('setUserName', '');
        }
        catch (_error) {
            if ('code' in _error) {
                const error = _error;
                if (error.code === 'auth/popup-closed-by-user') {
                    return;
                }
            }
            throw _error;
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Step FirstStep" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "EmailPasswordSignIn" }, { children: (0, jsx_runtime_1.jsx)(InputGroup, { children: (0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { type: "email", controller: email, placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", autoFocus: true }) }) })), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { onClick: signInWithEmail, active: formState.isValid, title: "\u7D9A\u884C" }), (0, jsx_runtime_1.jsx)(MyAlert_1.MyAlert, { active: !!((_a = formState.errors.result) === null || _a === void 0 ? void 0 : _a.message), title: (_b = formState.errors.result) === null || _b === void 0 ? void 0 : _b.message }), (0, jsx_runtime_1.jsx)(antd_1.Divider, {}), (0, jsx_runtime_1.jsx)(GoogleLoginButton, { onClick: signInWithGoogle })] })));
};
exports.FirstStep = FirstStep;
