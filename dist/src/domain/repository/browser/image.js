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
exports._BrowserRepository_Image = void 0;
const browser_image_compression_1 = __importDefault(require("browser-image-compression"));
var _BrowserRepository_Image;
(function (_BrowserRepository_Image) {
    _BrowserRepository_Image.loadFileAsDataUrl = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.addEventListener('load', e => {
                var _a;
                resolve(((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || '');
            });
            reader.readAsDataURL(file);
        });
    };
    _BrowserRepository_Image.compressFileIfLarge = (file, maxFileSizeMb = 0.8 /* 800kB */) => __awaiter(this, void 0, void 0, function* () {
        const limitSize = maxFileSizeMb * Math.pow(10, 6);
        if (file.size < limitSize) {
            // 100kb未満はそのまま
            const dataUrl = yield _BrowserRepository_Image.loadFileAsDataUrl(file);
            return { file, dataUrl };
        }
        else {
            console.warn(`compress ${file.size} to ${limitSize}`);
            // 100kb以上は圧縮する
            const newFileBlob = yield (0, browser_image_compression_1.default)(file, {
                // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
                // maxWidthOrHeight: 400,
                maxSizeMB: maxFileSizeMb,
            });
            const newFileDataUrl = yield browser_image_compression_1.default.getDataUrlFromFile(newFileBlob);
            yield browser_image_compression_1.default.getFilefromDataUrl(newFileDataUrl, 'new');
            return {
                file: newFileBlob,
                dataUrl: newFileDataUrl,
            };
        }
    });
})(_BrowserRepository_Image = exports._BrowserRepository_Image || (exports._BrowserRepository_Image = {}));
