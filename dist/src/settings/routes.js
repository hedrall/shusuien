"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = void 0;
const Top_1 = require("@frontend/components/pages/Top");
const Error_1 = require("@frontend/components/pages/Error");
const Login_1 = require("@frontend/components/pages/Login");
exports.ROUTES = {
    TOP: {
        PATH: '/',
        NAME: 'top',
        COMPONENT: Top_1.TopPage,
    },
    LOGIN: {
        PATH: '/login',
        NAME: 'login',
        COMPONENT: Login_1.LoginPage,
    },
    ERROR: {
        PATH: '/error',
        NAME: 'top',
        COMPONENT: Error_1.Error,
    },
};
