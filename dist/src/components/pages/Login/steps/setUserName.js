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
exports.SetUserNameStep = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const antd_1 = require("antd");
const InputGroup = antd_1.Input.Group;
const MyButton_1 = require("@frontend/components/atoms/MyButton");
const MyAlert_1 = require("@frontend/components/atoms/MyAlert");
const react_router_dom_1 = require("react-router-dom");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
const icons_1 = require("@ant-design/icons");
const action_1 = require("@frontend/store/auth/action");
const auth_1 = require("@frontend/domain/repository/auth");
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
const firestore_1 = require("@frontend/domain/repository/firestore");
const routes_1 = require("@frontend/settings/routes");
const SetUserNameStep = props => {
    var _a, _b, _c;
    const { setStep } = props;
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { setUser } = (0, action_1.useAuthState)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { control, getValues, setError, formState } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            userName: '',
            result: false,
        },
    });
    const controller = (0, react_hook_form_1.useController)({
        control,
        name: 'userName',
        rules: { required: '必須です。', maxLength: 10 },
    });
    const setUserName = () => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        if (!formState.isValid)
            return;
        const uid = (_d = auth_1.AuthRepository.get.user()) === null || _d === void 0 ? void 0 : _d.uid;
        if (!uid) {
            console.log('no user');
            return;
        }
        const { userName } = getValues();
        setIsLoading(true);
        try {
            const manager = new app_1.FsAppManager.User();
            yield firestore_1.FSAppRepository.update(manager, uid, {
                name: userName,
            });
            const user = yield firestore_1.FSAppRepository.getItem(manager, uid);
            setUser(user.value);
            navigate(routes_1.ROUTES.TOP.PATH);
        }
        catch (e) {
            setError('result', {
                message: '何らかのエラーが発生しました。恐れ入りますが、しばらく時間が経ってから再度操作してください。',
            });
        }
        finally {
            setIsLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Step NoAccountStep" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "Desc" }, { children: "\u767B\u9332\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\uFF01" })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Desc" }, { children: [(0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, { className: "Icon", color: "#929292" }), "\u30E6\u30FC\u30B6\u540D\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"] })), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(InputGroup, { children: (0, jsx_runtime_1.jsx)(MyInput_1.MyInput, { controller: controller, placeholder: "\u30E6\u30FC\u30B6\u540D", autoFocus: true }) }) }), (0, jsx_runtime_1.jsx)(MyAlert_1.MyAlert, { active: !!((_a = formState.errors.result) === null || _a === void 0 ? void 0 : _a.message), title: (_b = formState.errors.result) === null || _b === void 0 ? void 0 : _b.message }), (0, jsx_runtime_1.jsx)(MyAlert_1.MyAlert, { active: ((_c = formState.errors.userName) === null || _c === void 0 ? void 0 : _c.type) === 'maxLength', title: '10文字までで入力してください。' }), (0, jsx_runtime_1.jsx)(MyButton_1.MyButton, { onClick: setUserName, title: "\u767B\u9332", active: !isLoading && formState.isValid, isLoading: isLoading })] })));
};
exports.SetUserNameStep = SetUserNameStep;
