"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataState = exports.use鉢 = void 0;
const recoil_1 = require("recoil");
const atom_1 = require("@frontend/store/data/atom");
const firestore_1 = require("@frontend/domain/repository/firestore");
const 鉢Selector = (0, recoil_1.selectorFamily)({
    key: '鉢Selector',
    get: 棚ID => ({ get }) => {
        // return get(DATA_STATE_ATOM).鉢一覧;
        return get(atom_1.DATA_STATE_ATOM).鉢一覧[棚ID] || [];
    },
    set: 棚Id => ({ set }, items) => {
        set(atom_1.DATA_STATE_ATOM, pre => (Object.assign(Object.assign({}, pre), { 鉢一覧: Object.assign(Object.assign({}, pre.鉢一覧), { [棚Id]: items }) })));
    },
});
const use鉢 = (棚Id) => {
    const [state, set] = (0, recoil_1.useRecoilState)(鉢Selector(棚Id));
    const 鉢を購読 = (userId, 棚Id) => {
        return firestore_1.FSAppRepository.鉢.購読({ userId, 棚Id }, items => {
            set(items.map(i => i.value));
        });
    };
    return {
        鉢一覧: state,
        鉢を購読,
    };
};
exports.use鉢 = use鉢;
const useDataState = () => {
    const [state, setState] = (0, recoil_1.useRecoilState)(atom_1.DATA_STATE_ATOM);
    const set = {
        棚: (棚一覧) => {
            setState(pre => {
                return Object.assign(Object.assign({}, pre), { 棚一覧 });
            });
        },
        鉢: (棚Id, items) => {
            setState(pre => {
                return Object.assign(Object.assign({}, pre), { 鉢一覧: Object.assign(Object.assign({}, pre.鉢一覧), { [棚Id]: items }) });
            });
        },
    };
    const 棚を購読 = (userId) => {
        return firestore_1.FSAppRepository.棚.購読(userId, items => {
            set.棚(items.map(i => i.value));
        });
    };
    return {
        棚一覧: state.棚一覧,
        棚をSet: set.棚,
        鉢をSet: set.鉢,
        棚を購読,
    };
};
exports.useDataState = useDataState;
