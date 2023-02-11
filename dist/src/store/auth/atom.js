"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_STATE = void 0;
const recoil_1 = require("recoil");
exports.AUTH_STATE = (0, recoil_1.atom)({
    key: 'Auth',
    default: { user: undefined },
});
