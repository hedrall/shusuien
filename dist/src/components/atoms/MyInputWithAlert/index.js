"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyInputWithAlert = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const MyInput_1 = require("@frontend/components/atoms/MyInput");
function MyInputWithAlert(props) {
    var _a;
    const { controller, inputProps: _ip, alertProps: _ap } = props;
    const errorMessage = (_a = controller.fieldState.error) === null || _a === void 0 ? void 0 : _a.message;
    const alertProps = Object.assign({ type: 'error', showIcon: true, message: errorMessage }, _ap);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "MyInputWithAlert" }, { children: [(0, jsx_runtime_1.jsx)(MyInput_1.MyInput, Object.assign({ controller: controller }, _ip)), errorMessage ? (0, jsx_runtime_1.jsx)(antd_1.Alert, Object.assign({}, alertProps)) : undefined] })));
}
exports.MyInputWithAlert = MyInputWithAlert;
