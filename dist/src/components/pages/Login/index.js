"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = __importDefault(require("classnames"));
require("firebaseui/dist/firebaseui.css");
const firstStep_1 = require("@frontend/components/pages/Login/steps/firstStep");
const noAccount_1 = require("@frontend/components/pages/Login/steps/noAccount");
const setUserName_1 = require("@frontend/components/pages/Login/steps/setUserName");
const registerNewAccount_1 = require("@frontend/components/pages/Login/steps/registerNewAccount");
const inputPassword_1 = require("@frontend/components/pages/Login/steps/inputPassword");
const steps = {
    first: firstStep_1.FirstStep,
    inputPassword: inputPassword_1.InputPasswordStep,
    noAccount: noAccount_1.NoAccountStep,
    registerNewAccount: registerNewAccount_1.RegisterNewAccountStep,
    setUserName: setUserName_1.SetUserNameStep,
};
const LoginPage = props => {
    const { className } = props;
    const [state, setState] = (0, react_1.useState)({
        step: 'first',
        email: '',
    });
    const Component = steps[state.step];
    const setStepHandler = (step, email) => {
        setState({ step, email });
    };
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: (0, classnames_1.default)('LoginPage', className) }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "Content" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u30ED\u30B0\u30A4\u30F3" }), (0, jsx_runtime_1.jsx)(Component, { setStep: setStepHandler, email: state.email })] })) })));
};
exports.LoginPage = LoginPage;
