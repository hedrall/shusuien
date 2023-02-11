"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const pluralize = __importStar(require("pluralize"));
const change_case_1 = require("change-case");
const ROOT = path.resolve(__dirname, '..');
const COMPONENT_PATH = path.resolve(ROOT, 'src/components');
const COMPONENT_TYPES = {
    ATOM: 'Atom',
    MOLECULE: 'Molecule',
    ORGANISM: 'Organism',
    PAGE: 'Page',
};
const FILE_TYPES = {
    COMPONENT: 'component',
    SCSS: 'scss',
    SPEC: 'spec',
};
inquirer_1.default
    .prompt([
    {
        type: 'list',
        message: 'Which level component？',
        name: 'componentType',
        choices: Object.values(COMPONENT_TYPES),
    },
    {
        type: 'input',
        message: 'Component name ?',
        name: 'componentName',
    },
    {
        type: 'checkbox',
        message: 'Which file do you need ?',
        name: 'fileTypes',
        choices: Object.values(FILE_TYPES).map(type => ({
            name: type,
            checked: type !== 'spec',
        })),
    },
])
    .then((answers) => __awaiter(void 0, void 0, void 0, function* () {
    const { componentType, componentName: _cn, fileTypes } = answers;
    const ComponentName = (0, change_case_1.pascalCase)(_cn);
    console.log('>>> 1. create directory');
    const createDirPath = path.resolve(COMPONENT_PATH, pluralize.plural(componentType.toLowerCase()), (0, change_case_1.pascalCase)(ComponentName));
    console.log(`path: ${createDirPath}`);
    fs.mkdirSync(createDirPath);
    console.log('>>> 2. generating files');
    fileTypes
        .map(type => {
        switch (type) {
            case 'component':
                return {
                    fileName: 'index.tsx',
                    content: getComponentTemplate(fileTypes, ComponentName),
                };
            case 'scss':
                return {
                    fileName: 'index.scss',
                    content: `.${ComponentName} {
}`,
                };
            case 'spec':
                return {
                    fileName: 'index.spec.tsx',
                    content: getSpecTemplate(ComponentName, componentType),
                };
            default:
                throw new Error('unknown error');
        }
    })
        .map(file => {
        console.log(`emit file: ${file.fileName}`);
        fs.writeFileSync(path.resolve(createDirPath, file.fileName), file.content);
    });
    console.log('done');
}))
    .catch(error => {
    console.error('error', error);
});
const getComponentTemplate = (types, componentName) => {
    return `import React from 'react';

export type ${componentName}Props = {
  
};

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName}">
      
    </div>
  );
}
`;
};
const getSpecTemplate = (componentName, componentType) => {
    const type = pluralize.plural(componentType.toLowerCase());
    return `import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { ${componentName}, ${componentName}Props } from "@frontend/components/${type}/${componentName}/index";

describe('${componentName}', () => {
  
  let container: HTMLElement;
  
  const props: ${componentName}Props = {
    
  }
  
  beforeAll(() => {
    const tree = render(<${componentName} {...(props)} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
`;
};
