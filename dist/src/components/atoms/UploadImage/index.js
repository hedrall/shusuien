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
exports.UploadImage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const browser_1 = require("@frontend/domain/repository/browser");
const ui_1 = require("@frontend/supports/ui");
function UploadImage(props) {
    const { field } = props;
    const { withLoading, isLoading } = (0, ui_1.useWithLoading)();
    const setImageUrl = (dataUrl) => {
        field.onChange(dataUrl);
    };
    const imageUrl = field.value;
    const handleChange = (info) => __awaiter(this, void 0, void 0, function* () {
        if (info.file.status === 'done') {
            yield withLoading(() => __awaiter(this, void 0, void 0, function* () {
                const { dataUrl } = yield browser_1.BrowserRepository.Image.compressFileIfLarge(info.file.originFileObj);
                setImageUrl(dataUrl);
            }));
        }
    });
    const uploadButton = ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "UploadButton" }, { children: [isLoading ? (0, jsx_runtime_1.jsx)(icons_1.LoadingOutlined, {}) : (0, jsx_runtime_1.jsx)(icons_1.CameraOutlined, {}), (0, jsx_runtime_1.jsx)("div", { children: "Upload" })] })));
    const uploadProps = {
        className: 'UploadImage',
        listType: 'picture',
        accept: 'image/jpg, image/jpeg, image/png',
        // onPreview: handlePreview,
        onChange: handleChange,
        customRequest: options => {
            const { onSuccess } = options;
            console.log('customRequest');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess({});
        },
        onRemove: () => setImageUrl(undefined),
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(antd_1.Upload, Object.assign({}, uploadProps, { children: imageUrl ? (0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "avatar", style: { width: '100%', maxHeight: '40vh' } }) : uploadButton })) }));
}
exports.UploadImage = UploadImage;
