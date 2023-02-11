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
exports.FSAppRepository = void 0;
const fs = __importStar(require("firebase/firestore"));
const array_1 = require("@frontend/supports/array");
const tana_1 = require("@frontend/domain/repository/firestore/tana");
const item_1 = require("@frontend/domain/repository/firestore/item");
const history_1 = require("@frontend/domain/repository/firestore/history");
var FSAppRepository;
(function (FSAppRepository) {
    const db = () => fs.getFirestore();
    FSAppRepository.getCollection = (manager) => {
        const collection = fs.collection(db(), manager.path);
        return collection.withConverter(manager.converter);
    };
    FSAppRepository.querySnapshotToRefValues = (snapshot) => {
        const refValue = [];
        let lastDocSnapshot = undefined;
        snapshot.forEach(item => {
            lastDocSnapshot = item;
            refValue.push({
                ref: item.ref,
                value: item.data(),
            });
        });
        return { refValue, lastDocSnapshot };
    };
    FSAppRepository.documentSnapshotToRefValue = (snapshot) => {
        return {
            ref: snapshot.ref,
            value: snapshot.data(),
        };
    };
    const getQuery = (collection, { limit, wheres, orderBy, startAfter }) => {
        const conditions = [];
        if (orderBy) {
            for (const { key, dir } of (0, array_1.toArray)(orderBy)) {
                conditions.push(fs.orderBy(key, dir));
            }
        }
        if (startAfter)
            conditions.push(fs.startAfter(startAfter));
        if (limit)
            conditions.push(fs.limit(limit));
        return fs.query(collection, ...(wheres || []), ...conditions);
    };
    FSAppRepository.getItems = (manager, conditions) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const query = getQuery(collection, conditions);
        const res = FSAppRepository.querySnapshotToRefValues(yield fs.getDocs(query));
        return {
            items: res.refValue,
            lastDocSnapshot: res.lastDocSnapshot,
        };
    });
    FSAppRepository.getItem = (manager, id) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, id);
        const res = yield fs.getDoc(doc);
        return FSAppRepository.documentSnapshotToRefValue(res);
    });
    FSAppRepository.getByRef = (ref) => __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield fs.getDoc(ref);
        return FSAppRepository.documentSnapshotToRefValue(snapshot);
    });
    FSAppRepository.count = (manager) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const res = yield fs.getDocs(collection);
        return res.size;
    });
    FSAppRepository.addItem = (manager, entity) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        return yield fs.addDoc(collection, entity);
    });
    FSAppRepository.addItemWithId = (manager, entity) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, entity.id);
        yield fs.setDoc(doc, entity);
    });
    FSAppRepository.isExist = (manager, id) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, id);
        const item = yield fs.getDoc(doc);
        return item.exists();
    });
    FSAppRepository.update = (manager, id, attrs) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, id);
        yield fs.updateDoc(doc, attrs);
    });
    FSAppRepository.deleteItem = (manager, id) => __awaiter(this, void 0, void 0, function* () {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, id);
        yield fs.deleteDoc(doc);
    });
    FSAppRepository.listenById = (manager, id, onListen) => {
        const collection = FSAppRepository.getCollection(manager);
        const doc = fs.doc(collection, id);
        const unsubscribe = fs.onSnapshot(doc, docSnapshot => {
            onListen(FSAppRepository.documentSnapshotToRefValue(docSnapshot));
        });
        return { unsubscribe };
    };
    FSAppRepository.listenList = (manager, condition, onListen) => {
        const collection = FSAppRepository.getCollection(manager);
        const query = getQuery(collection, condition);
        const unsubscribe = fs.onSnapshot(query, querySnapshot => {
            const parsed = FSAppRepository.querySnapshotToRefValues(querySnapshot);
            onListen(parsed.refValue);
        });
        return { unsubscribe };
    };
    FSAppRepository.棚 = tana_1._FsApp棚Repository;
    FSAppRepository.鉢 = item_1._FsApp鉢Repository;
    FSAppRepository.履歴 = history_1._FsApp履歴Repository;
})(FSAppRepository = exports.FSAppRepository || (exports.FSAppRepository = {}));
