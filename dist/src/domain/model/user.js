"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    // ルーム
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
    }
}
exports.User = User;
User.createDefault = (id) => {
    return new User({
        id: id,
        name: '名前未設定',
    });
};
