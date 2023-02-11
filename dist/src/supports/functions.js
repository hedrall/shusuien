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
exports.tObjectValues = exports.sleep = exports.toUnique = exports.nullableCall = exports.optionalCall = exports.isDefined = exports.typedToUpperCase = exports.equalFn = void 0;
const equalFn = (value) => value;
exports.equalFn = equalFn;
const typedToUpperCase = (text) => {
    return text.toUpperCase();
};
exports.typedToUpperCase = typedToUpperCase;
const isDefined = (value) => {
    return value !== undefined && value !== null;
};
exports.isDefined = isDefined;
const optionalCall = (value, callback) => {
    if (!(0, exports.isDefined)(value))
        return undefined;
    return callback(value);
};
exports.optionalCall = optionalCall;
const nullableCall = (value, callback) => {
    if (!(0, exports.isDefined)(value))
        return null;
    return callback(value);
};
exports.nullableCall = nullableCall;
const toUnique = (arr) => {
    return [...new Set(arr)];
};
exports.toUnique = toUnique;
const sleep = (time) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, time));
});
exports.sleep = sleep;
const tObjectValues = (item) => {
    return Object.values(item);
};
exports.tObjectValues = tObjectValues;
