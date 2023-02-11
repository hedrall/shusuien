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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._新規作成する = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const firestore_1 = require("@frontend/domain/repository/firestore");
const storage_1 = require("@frontend/domain/repository/storage");
const history_1 = require("@frontend/domain/model/history");
const item_1 = require("@frontend/domain/model/item");
const _新規作成する = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageDataUrl, props } = params;
    const { userId } = props;
    const now = (0, dayjs_1.default)();
    console.log('1. 鉢を作成する');
    const 新規鉢 = new item_1.鉢(Object.assign(Object.assign({}, props), { id: undefined, snapshot: {
            更新日時: now,
        }, 作成日時: now }));
    const { 鉢ID } = yield firestore_1.FSAppRepository.鉢.作成(新規鉢);
    console.log('2. 画像をUpload');
    const { 画像のPATH } = yield storage_1.StorageRepository.uploadImageByBase64String({
        dataUrl: imageDataUrl,
        path: storage_1.StorageRepository.storagePath({
            type: '鉢',
            userId,
            datetime: now,
            itemId: 鉢ID,
        }),
    });
    console.log('3. 画像の変更履歴を作成する');
    yield history_1.履歴.新規作成.画像の更新歴({
        props: {
            作成日時: now,
            userId,
            対象の鉢のID: 鉢ID,
            対象の棚のID: undefined,
        },
        内容: {
            画像のPATH,
        },
    });
    console.log('4. 鉢を更新する');
    yield firestore_1.FSAppRepository.鉢.画像を更新(鉢ID, 画像のPATH, now);
});
exports._新規作成する = _新規作成する;
