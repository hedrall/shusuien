"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports._FsApp鉢Repository = void 0;
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
const index_1 = require("@frontend/domain/repository/firestore/index");
const fs = __importStar(require("firebase/firestore"));
const app_2 = require("@frontend/domain/repository/firebase/converters/app");
var _FsApp鉢Repository;
(function (_FsApp鉢Repository) {
    _FsApp鉢Repository.作成 = (新規鉢) => __awaiter(this, void 0, void 0, function* () {
        const manager = new app_1.FsAppManager.鉢();
        const ref = yield index_1.FSAppRepository.addItem(manager, 新規鉢);
        return { 鉢ID: ref.id };
    });
    _FsApp鉢Repository.snapshotを更新 = (id, 更新後のsnapshot, date) => __awaiter(this, void 0, void 0, function* () {
        const manager = new app_1.FsAppManager.鉢();
        const rawUpdateParams = Object.entries(更新後のsnapshot).reduce((p, [key, value]) => {
            return Object.assign(Object.assign({}, p), { [`snapshot.${key}`]: value });
        }, {
            'snapshot.更新日時': date.format(),
        });
        const updateParams = (0, app_2.basicToFirestore)(rawUpdateParams);
        yield index_1.FSAppRepository.update(manager, id, updateParams);
    });
    _FsApp鉢Repository.画像を更新 = (id, 画像のPATH, date) => __awaiter(this, void 0, void 0, function* () {
        yield _FsApp鉢Repository.snapshotを更新(id, { 画像のPATH }, date);
    });
    _FsApp鉢Repository.購読 = (params, onListen) => {
        const { userId, 棚Id } = params;
        const manager = new app_1.FsAppManager.鉢();
        const { unsubscribe } = index_1.FSAppRepository.listenList(manager, {
            wheres: [fs.where('userId', '==', userId), fs.where('棚Id', '==', 棚Id)],
            orderBy: { key: '作成日時', dir: 'asc' },
        }, items => onListen(items));
        return { unsubscribe };
    };
})(_FsApp鉢Repository = exports._FsApp鉢Repository || (exports._FsApp鉢Repository = {}));
