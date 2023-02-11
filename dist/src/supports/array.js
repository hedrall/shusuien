"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleArray = exports.toArray = exports.uniqueArray = exports.findById = void 0;
const findById = (arr, idToFind) => {
    return arr.find(i => i.id === idToFind);
};
exports.findById = findById;
const uniqueArray = (array) => {
    return [...new Set(array)];
};
exports.uniqueArray = uniqueArray;
const toArray = (mayBeArray) => {
    if (Array.isArray(mayBeArray)) {
        return mayBeArray;
    }
    return [mayBeArray];
};
exports.toArray = toArray;
const toggleArray = (array, item) => {
    if (array.includes(item)) {
        return {
            type: 'remove',
            items: array.filter(i => i !== item),
        };
    }
    return {
        type: 'add',
        items: [...array, item],
    };
};
exports.toggleArray = toggleArray;
