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
exports.useAuthState = void 0;
const recoil_1 = require("recoil");
const atom_1 = require("@frontend/store/auth/atom");
const firestore_1 = require("@frontend/domain/repository/firestore");
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
let unsubscribe = null;
const useAuthState = () => {
    var _a;
    const [state, setState] = (0, recoil_1.useRecoilState)(atom_1.AUTH_STATE);
    const isAuthed = !!((_a = state.user) === null || _a === void 0 ? void 0 : _a.name);
    const setUser = (user) => {
        setState(pre => {
            return Object.assign(Object.assign({}, pre), { user });
        });
    };
    const authStateChangeSubscriber = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('認証状態が変化しました！', { authUser });
        if (!authUser) {
            // detect sign out
            unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe();
            setUser(undefined);
            return;
        }
        // detect sign in
        const manager = new app_1.FsAppManager.User();
        try {
            const res = firestore_1.FSAppRepository.listenById(manager, authUser.uid, user => {
                console.log('listen user data');
                setUser(user.value);
            });
            unsubscribe = res.unsubscribe;
        }
        catch (e) {
            console.error(e);
        }
    });
    return {
        user: state.user,
        setUser: setUser,
        isAuthed,
        authStateChangeSubscriber,
    };
};
exports.useAuthState = useAuthState;
