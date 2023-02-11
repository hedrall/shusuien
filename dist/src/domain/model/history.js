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
exports.履歴 = exports.履歴のBase = exports.履歴の内容 = exports.鉢サイズ = void 0;
const firestore_1 = require("@frontend/domain/repository/firestore");
var 鉢サイズ;
(function (鉢サイズ) {
    鉢サイズ.番号 = ['2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5'];
    鉢サイズ.タイプ = ['通常', 'L'];
})(鉢サイズ = exports.鉢サイズ || (exports.鉢サイズ = {}));
var 履歴の内容;
(function (履歴の内容) {
    // 灌水履歴
    let 灌水;
    (function (灌水) {
        灌水.量の定義 = {
            表面が濡れる程度: {
                key: '表面が濡れる程度',
                表示名: '表面が濡れる程度',
            },
            ['1/3程度']: {
                key: '1/3程度',
                表示名: '1/3程度',
            },
            ['2/3程度']: {
                key: '2/3程度',
                表示名: '2/3程度',
            },
            ['鉢いっぱい']: {
                key: '鉢いっぱい',
                表示名: '鉢いっぱい',
            },
            ['流れ出るくらい']: {
                key: '流れ出るくらい',
                表示名: '流れ出るくらい',
            },
        };
        灌水.量のKey = Object.values(灌水.量の定義).map(i => i.key);
    })(灌水 = 履歴の内容.灌水 || (履歴の内容.灌水 = {}));
})(履歴の内容 = exports.履歴の内容 || (exports.履歴の内容 = {}));
const 作成 = (新規履歴) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = yield firestore_1.FSAppRepository.履歴.作成(新規履歴);
    return new 履歴(Object.assign(Object.assign({}, 新規履歴), { id }));
});
const _画像の更新歴を作成 = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { props, 内容 } = params;
    const 新規履歴 = new 履歴(Object.assign(Object.assign({ id: undefined }, props), { 内容: Object.assign({ type: '画像を更新' }, 内容) }));
    return yield 作成(新規履歴);
});
const _植替え履歴を作成 = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { props, 内容 } = params;
    const { 植替え日時, 鉢のサイズ, 植替え後の画像のPATH, memo } = 内容;
    const 新規履歴 = new 履歴(Object.assign(Object.assign({ id: undefined }, props), { 内容: {
            type: '植替え',
            植替え日時,
            鉢のサイズ,
            植替え後の画像のPATH,
            memo,
        } }));
    return yield 作成(新規履歴);
});
class 履歴のBase {
    constructor(props) {
        this.id = props.id;
        this.userId = props.userId;
        this.作成日時 = props.作成日時;
        this.対象の棚のID = props.対象の棚のID;
        this.対象の鉢のID = props.対象の鉢のID;
        this.内容 = props.内容;
    }
}
exports.履歴のBase = 履歴のBase;
class 履歴 extends 履歴のBase {
    constructor(props) {
        super(props);
    }
    is灌水() {
        return this.内容.type === '灌水';
    }
    is画像を更新() {
        return this.内容.type === '画像を更新';
    }
    is成長の記録() {
        return this.内容.type === '成長の記録';
    }
    is植替え() {
        return this.内容.type === '植替え';
    }
}
exports.履歴 = 履歴;
履歴.新規作成 = {
    画像の更新歴: _画像の更新歴を作成,
    植替え: _植替え履歴を作成,
};
