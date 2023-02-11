"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.棚一覧表示 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const ItemList_1 = require("@frontend/components/molecules/ItemList");
const { Panel } = antd_1.Collapse;
const 棚一覧表示 = props => {
    const { 棚一覧 } = props;
    return ((0, jsx_runtime_1.jsx)(antd_1.Collapse, Object.assign({ className: "\u68DA\u4E00\u89A7\u8868\u793A", defaultActiveKey: undefined }, { children: 棚一覧.map((棚, index) => ((0, jsx_runtime_1.jsx)(Panel, Object.assign({ header: 棚.name }, { children: (0, jsx_runtime_1.jsx)(ItemList_1.鉢一覧, { "\u68DA": 棚 }, index) }), index))) })));
};
exports.棚一覧表示 = 棚一覧表示;
