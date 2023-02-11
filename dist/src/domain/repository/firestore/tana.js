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
exports._FsApp棚Repository = void 0;
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
const index_1 = require("@frontend/domain/repository/firestore/index");
const fs = __importStar(require("firebase/firestore"));
var _FsApp棚Repository;
(function (_FsApp棚Repository) {
    _FsApp棚Repository.作成 = (新規棚) => __awaiter(this, void 0, void 0, function* () {
        const manager = new app_1.FsAppManager.棚();
        yield index_1.FSAppRepository.addItem(manager, 新規棚);
    });
    _FsApp棚Repository.購読 = (userId, onListen) => {
        const manager = new app_1.FsAppManager.棚();
        const { unsubscribe } = index_1.FSAppRepository.listenList(manager, {
            wheres: [fs.where('userId', '==', userId)],
            orderBy: { key: '作成日時', dir: 'asc' },
        }, items => onListen(items));
        return { unsubscribe };
    };
})(_FsApp棚Repository = exports._FsApp棚Repository || (exports._FsApp棚Repository = {}));
