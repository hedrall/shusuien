"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.鉢一覧の要素 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const storage_1 = require("@frontend/domain/repository/storage");
const antd_1 = require("antd");
const item_1 = require("@frontend/domain/model/item");
const 鉢一覧の要素 = props => {
    const { item, 鉢を選択 } = props;
    const [imageUrl, setImageUrl] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const path = item.snapshot.画像のPATH;
        if (!path)
            return;
        storage_1.StorageRepository.getDownloadUrls(path).then(setImageUrl);
    }, [item_1.鉢]);
    const imageProps = {
        className: '鉢一覧の要素',
        preview: false,
        src: imageUrl,
        style: { borderRadius: 7 },
        onClick: () => 鉢を選択(item),
    };
    return (0, jsx_runtime_1.jsx)(antd_1.Image, Object.assign({}, imageProps));
};
exports.鉢一覧の要素 = 鉢一覧の要素;
