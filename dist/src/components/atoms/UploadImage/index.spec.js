"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const pure_1 = require("@testing-library/react/pure");
const index_1 = require("@frontend/components/atoms/UploadImage/index");
describe('UploadImage', () => {
    let container;
    const props = {};
    beforeAll(() => {
        const tree = (0, pure_1.render)((0, jsx_runtime_1.jsx)(index_1.UploadImage, Object.assign({}, (props))));
        container = tree.container;
    });
    test('snapshot', () => {
        expect(container).toMatchSnapshot();
    });
});
