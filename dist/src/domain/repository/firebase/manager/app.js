"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsAppManager = void 0;
const manager_1 = require("@frontend/domain/repository/firebase/manager");
const app_1 = require("@frontend/domain/repository/firebase/converters/app");
var FsAppManager;
(function (FsAppManager) {
    class 鉢 extends manager_1.FsManager.鉢 {
        constructor() {
            super(app_1.appConverters.鉢);
        }
    }
    FsAppManager.鉢 = 鉢;
    class 棚 extends manager_1.FsManager.棚 {
        constructor() {
            super(app_1.appConverters.棚);
        }
    }
    FsAppManager.棚 = 棚;
    class 履歴 extends manager_1.FsManager.履歴 {
        constructor() {
            super(app_1.appConverters.履歴);
        }
    }
    FsAppManager.履歴 = 履歴;
    class User extends manager_1.FsManager.User {
        constructor() {
            super(app_1.appConverters.User);
        }
    }
    FsAppManager.User = User;
})(FsAppManager = exports.FsAppManager || (exports.FsAppManager = {}));
