"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const react_1 = require("react");
const auth_1 = require("@frontend/domain/repository/auth");
const action_1 = require("@frontend/store/auth/action");
const Utils = () => {
    const { authStateChangeSubscriber } = (0, action_1.useAuthState)();
    (0, react_1.useEffect)(() => {
        auth_1.AuthRepository.listen.authStateChanged(authStateChangeSubscriber);
    }, []);
    return null;
};
exports.Utils = Utils;
