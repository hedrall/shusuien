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
exports.StorageRepository = void 0;
const storage_1 = require("firebase/storage");
var StorageRepository;
(function (StorageRepository) {
    StorageRepository.storagePath = (params) => {
        const { userId, type, datetime, itemId, index } = params;
        const postfix = index ? `_${index}` : '';
        const fileName = `${datetime.format()}${postfix}`;
        return [userId, type, itemId, fileName].join('/');
    };
    const getStorageRef = () => {
        const s = (0, storage_1.getStorage)();
        return (0, storage_1.ref)(s);
    };
    const getStorageItemRef = (filePath) => {
        const storageRef = getStorageRef();
        return (0, storage_1.ref)(storageRef, filePath);
    };
    StorageRepository.getDownloadUrls = (path) => __awaiter(this, void 0, void 0, function* () {
        const ref = getStorageItemRef(path);
        return (0, storage_1.getDownloadURL)(ref);
    });
    // export const uploadImage = async (params: { filePath: T画像のPATH; file: File }) => {
    //   const { filePath, file } = params;
    //   const itemRef = getStorageItemRef(filePath);
    //   const res = await uploadBytes(itemRef, file);
    //   return { 画像のPATH: res.ref.fullPath };
    // };
    StorageRepository.uploadImageByBase64String = (params) => __awaiter(this, void 0, void 0, function* () {
        const { path, dataUrl } = params;
        const itemRef = getStorageItemRef(path);
        const res = yield (0, storage_1.uploadString)(itemRef, dataUrl, 'data_url');
        return { 画像のPATH: res.ref.fullPath };
    });
    StorageRepository.deleteItems = (dirPath) => __awaiter(this, void 0, void 0, function* () {
        const dirRef = getStorageItemRef(dirPath);
        const items = yield (0, storage_1.listAll)(dirRef);
        for (const item of items.items) {
            const path = item.fullPath;
            console.log('delete path: ', path);
            const ref = getStorageItemRef(path);
            yield (0, storage_1.deleteObject)(ref);
        }
    });
})(StorageRepository = exports.StorageRepository || (exports.StorageRepository = {}));
