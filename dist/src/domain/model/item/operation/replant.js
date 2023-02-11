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
exports._植替えする = void 0;
const history_1 = require("@frontend/domain/model/history");
const storage_1 = require("@frontend/domain/repository/storage");
const firestore_1 = require("@frontend/domain/repository/firestore");
const _植替えする = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { item, imageDataUrl, userId, 鉢のサイズ, date, memo } = params;
    console.log('1. 画像をuploadする');
    const 鉢Id = item.id;
    const { 画像のPATH } = yield storage_1.StorageRepository.uploadImageByBase64String({
        dataUrl: imageDataUrl,
        path: storage_1.StorageRepository.storagePath({
            type: '鉢',
            userId,
            datetime: date,
            itemId: 鉢Id,
        }),
    });
    console.log('2. 植替えの履歴を作成');
    const 植替え履歴 = yield history_1.履歴.新規作成.植替え({
        props: {
            userId,
            作成日時: date,
            対象の棚のID: undefined,
            対象の鉢のID: 鉢Id,
        },
        内容: {
            植替え後の画像のPATH: 画像のPATH,
            植替え日時: date,
            鉢のサイズ,
            memo,
        },
    });
    console.log('3. 鉢の情報を更新する');
    const 更新後の鉢 = item.履歴を適用(植替え履歴);
    yield firestore_1.FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
});
exports._植替えする = _植替えする;
