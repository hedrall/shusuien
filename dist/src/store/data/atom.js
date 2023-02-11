"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_STATE_ATOM = void 0;
const recoil_1 = require("recoil");
exports.DATA_STATE_ATOM = (0, recoil_1.atom)({
    key: 'Data',
    default: { 棚一覧: [], 鉢一覧: {} },
});
