"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleState = void 0;
const recoil_1 = require("recoil");
exports.sampleState = (0, recoil_1.atom)({
    key: 'sample state',
    default: { count: 0 },
});
