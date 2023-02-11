"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = __importDefault(require("classnames"));
const antd_1 = require("antd");
const MyButton = props => {
    const { className, title, active = true, onClick, isLoading } = props, rest = __rest(props, ["className", "title", "active", "onClick", "isLoading"]);
    const onClickHandler = () => {
        if (!active)
            return;
        onClick();
    };
    const buttonProps = Object.assign({ className: (0, classnames_1.default)('MyButton', className, { Active: active }), onClick, loading: isLoading }, rest);
    return (0, jsx_runtime_1.jsx)(antd_1.Button, Object.assign({}, buttonProps, { children: title }));
};
exports.MyButton = MyButton;
