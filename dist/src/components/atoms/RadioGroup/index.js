"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
function RadioGroup(props) {
    const { field, options } = props;
    return ((0, jsx_runtime_1.jsx)(antd_1.Radio.Group, Object.assign({ className: "RadioGroup", buttonStyle: "solid" }, field, { children: options.map(({ value, name }) => {
            return ((0, jsx_runtime_1.jsx)(antd_1.Radio.Button, Object.assign({ value: value }, { children: name }), value));
        }) })));
}
exports.RadioGroup = RadioGroup;
