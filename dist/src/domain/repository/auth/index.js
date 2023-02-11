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
exports.AuthRepository = void 0;
const auth_1 = require("firebase/auth");
const user_1 = require("@frontend/domain/model/user");
const app_1 = require("@frontend/domain/repository/firebase/manager/app");
const firestore_1 = require("@frontend/domain/repository/firestore");
const auth = (0, auth_1.getAuth)();
auth.languageCode = 'ja';
const googleProvider = new auth_1.GoogleAuthProvider();
var AuthRepository;
(function (AuthRepository) {
    let get;
    (function (get) {
        get.user = () => auth.currentUser;
        get.signInMethodForEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, auth_1.fetchSignInMethodsForEmail)(auth, email);
            if (result.length === 0)
                return 'no-account';
            if (result.includes('google.com'))
                return 'registered-with-google';
            return 'with-email';
        });
    })(get = AuthRepository.get || (AuthRepository.get = {}));
    let signIn;
    (function (signIn) {
        signIn.withGoogle = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, auth_1.signInWithPopup)(auth, googleProvider);
            const uid = result.user.uid;
            const manager = new app_1.FsAppManager.User();
            const user = yield firestore_1.FSAppRepository.getItem(manager, uid);
            if (user.value) {
                return { dbUser: user.value, uid };
            }
            return { uid, dbUser: undefined };
        });
        signIn.withEmail = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
        });
    })(signIn = AuthRepository.signIn || (AuthRepository.signIn = {}));
    AuthRepository.signOut = () => __awaiter(this, void 0, void 0, function* () {
        yield (0, auth_1.signOut)(auth);
    });
    let createAccount;
    (function (createAccount) {
        createAccount.withEmail = (email, password) => __awaiter(this, void 0, void 0, function* () {
            // create new account
            const result = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            // create new user to firestore
            const manager = new app_1.FsAppManager.User();
            const newUser = user_1.User.createDefault(result.user.uid);
            yield firestore_1.FSAppRepository.addItemWithId(manager, newUser);
            return newUser;
        });
    })(createAccount = AuthRepository.createAccount || (AuthRepository.createAccount = {}));
    let listen;
    (function (listen) {
        listen.authStateChanged = (callback) => {
            (0, auth_1.onAuthStateChanged)(auth, callback);
        };
    })(listen = AuthRepository.listen || (AuthRepository.listen = {}));
})(AuthRepository = exports.AuthRepository || (exports.AuthRepository = {}));
