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
exports.棚 = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const firestore_1 = require("@frontend/domain/repository/firestore");
class 棚 {
    static 新規作成(v) {
        return __awaiter(this, void 0, void 0, function* () {
            const 新規棚 = new 棚(Object.assign({ id: undefined, 作成日時: (0, dayjs_1.default)() }, v));
            yield firestore_1.FSAppRepository.棚.作成(新規棚);
        });
    }
    // ルーム
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.userId = props.userId;
        this.作成日時 = (0, dayjs_1.default)(props.作成日時);
    }
}
exports.棚 = 棚;
