"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsManager = void 0;
// eslint-disable-next-line
var FsManager;
(function (FsManager) {
    class 棚 {
        constructor(converter) {
            this.converter = converter;
            this.path = 棚.createPath();
        }
    }
    棚._name = '棚';
    棚.createPath = () => 棚._name;
    FsManager.棚 = 棚;
    class 鉢 {
        constructor(converter) {
            this.converter = converter;
            this.path = 鉢.createPath();
        }
    }
    鉢._name = '鉢';
    鉢.createPath = () => 鉢._name;
    FsManager.鉢 = 鉢;
    class 履歴 {
        constructor(converter) {
            this.converter = converter;
            this.path = 履歴.createPath();
        }
    }
    履歴._name = '履歴';
    履歴.createPath = () => 履歴._name;
    FsManager.履歴 = 履歴;
    class User {
        constructor(converter) {
            this.converter = converter;
            this.path = User.createPath();
        }
    }
    User._name = 'user';
    User.createPath = () => User._name;
    FsManager.User = User;
})(FsManager = exports.FsManager || (exports.FsManager = {}));
