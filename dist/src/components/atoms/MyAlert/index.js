"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAlert = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = __importDefault(require("classnames"));
const antd_1 = require("antd");
const MyAlert = props => {
    const { className, active, title, description } = props;
    if (!active)
        return null;
    const alertProps = {
        className: (0, classnames_1.default)('MyAlert', className),
        type: 'error',
        showIcon: true,
        message: title,
        description,
    };
    return (0, jsx_runtime_1.jsx)(antd_1.Alert, Object.assign({}, alertProps));
};
exports.MyAlert = MyAlert;
