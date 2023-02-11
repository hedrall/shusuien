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
exports.appConverters = exports.basicConverter = exports.basicFromFirestore = exports.basicToFirestore = exports.removeId = exports.dateToFirestore = exports.dropUndefined = void 0;
const history_1 = require("@frontend/domain/model/history");
const item_1 = require("@frontend/domain/model/item");
const tana_1 = require("@frontend/domain/model/tana");
const user_1 = require("@frontend/domain/model/user");
const dayjs_1 = __importDefault(require("dayjs"));
const dropUndefined = (obj) => {
    Object.keys(obj).map(key => {
        const value = obj[key];
        if (value === undefined) {
            obj[key] = null;
            return;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            obj[key] = (0, exports.dropUndefined)(value);
            return;
        }
    });
    return obj;
};
exports.dropUndefined = dropUndefined;
const dateToFirestore = (obj) => {
    Object.keys(obj).map(key => {
        const value = obj[key];
        if (value instanceof dayjs_1.default) {
            obj[key] = value.format();
            return;
        }
        if (value === null)
            return value;
        if (typeof value === 'object' && !Array.isArray(value)) {
            obj[key] = (0, exports.dateToFirestore)(value);
            return;
        }
    });
    return obj;
};
exports.dateToFirestore = dateToFirestore;
const removeId = (obj) => {
    const { id } = obj, rest = __rest(obj, ["id"]);
    return rest;
};
exports.removeId = removeId;
const basicToFirestore = (item) => {
    return (0, exports.dateToFirestore)((0, exports.dropUndefined)((0, exports.removeId)(Object.assign({}, item))));
};
exports.basicToFirestore = basicToFirestore;
const basicFromFirestore = (construct) => {
    return (snapshot) => {
        const data = snapshot.data();
        const id = snapshot.ref.id;
        return new construct(Object.assign(Object.assign({}, data), { id }));
    };
};
exports.basicFromFirestore = basicFromFirestore;
const basicConverter = (construct) => {
    return {
        toFirestore: exports.basicToFirestore,
        fromFirestore: (0, exports.basicFromFirestore)(construct),
    };
};
exports.basicConverter = basicConverter;
exports.appConverters = {
    棚: (0, exports.basicConverter)(tana_1.棚),
    鉢: (0, exports.basicConverter)(item_1.鉢),
    履歴: (0, exports.basicConverter)(history_1.履歴),
    User: (0, exports.basicConverter)(user_1.User),
};
