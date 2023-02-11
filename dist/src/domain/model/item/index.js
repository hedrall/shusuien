"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.鉢 = exports.鉢のBase = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const functions_1 = require("@frontend/supports/functions");
const replant_1 = require("@frontend/domain/model/item/operation/replant");
const newItem_1 = require("@frontend/domain/model/item/operation/newItem");
class 鉢のBase {
    constructor(props) {
        this.id = props.id;
        this.userId = props.userId;
        this.name = props.name;
        this.棚Id = props.棚Id;
        this.snapshot = {
            鉢のサイズ: props.snapshot.鉢のサイズ,
            最後の植替え: (0, functions_1.optionalCall)(props.snapshot.最後の植替え, dayjs_1.default),
            画像のPATH: props.snapshot.画像のPATH,
            更新日時: (0, dayjs_1.default)(props.snapshot.更新日時),
        };
        this.詳細 = {
            科: props.詳細.科,
            属: props.詳細.属,
            種名: props.詳細.種名,
        };
        this.補足 = props.補足;
        this.作成日時 = (0, dayjs_1.default)(props.作成日時);
    }
}
exports.鉢のBase = 鉢のBase;
const update = (cur, 更新するsnapshotの項目, 履歴の作成日時) => {
    return new 鉢(Object.assign(Object.assign({}, cur), { snapshot: Object.assign(Object.assign(Object.assign({}, cur.snapshot), 更新するsnapshotの項目), { 更新日時: 履歴の作成日時 }) }));
};
function _履歴を適用(履歴) {
    const type = 履歴.内容.type;
    switch (type) {
        case '植替え':
            // [更新項目] 鉢サイズ, 最後の植替え, 画像
            return update(this, {
                鉢のサイズ: 履歴.内容.鉢のサイズ,
                最後の植替え: 履歴.内容.植替え日時,
                画像のPATH: 履歴.内容.植替え後の画像のPATH,
            }, 履歴.作成日時);
        default:
            throw new Error(`実装されていません。type: ${type}`);
    }
}
class 鉢 extends 鉢のBase {
    constructor(props) {
        super(props);
        this.履歴を適用 = _履歴を適用;
    }
}
exports.鉢 = 鉢;
鉢.管理 = {
    新規作成: newItem_1._新規作成する,
    植替え: replant_1._植替えする,
};
鉢.create = () => {
    /**
     * 1. 鉢を生成するf
     * 2. 画像の更新歴を作成する
     * 3. 鉢の画像を更新する
     */
    // const 鉢 = new 鉢()
    // 画像の更新歴を作成する
};
