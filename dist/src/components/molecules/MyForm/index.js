"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFormLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = __importDefault(require("classnames"));
const MyFormLayout = props => {
    const { items } = props;
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "MyFormLayout" }, { children: items.map((i, index) => {
            const { label, input, type, align = 'left' } = i;
            const baseClasses = ['Item', { Right: align === 'right' }];
            const labelElem = typeof label === 'string' ? (0, jsx_runtime_1.jsx)("label", { children: label }) : label;
            if (type === 'oneLine') {
                return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: (0, classnames_1.default)(...baseClasses, 'OneLine') }, { children: [labelElem, input] }), index));
            }
            return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: (0, classnames_1.default)(...baseClasses) }, { children: [labelElem, input] }), index));
        }) })));
};
exports.MyFormLayout = MyFormLayout;
