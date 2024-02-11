import { ValueOf } from 'type-fest';

export const _灌水量 = {
  表面が濡れる程度: {
    key: '表面が濡れる程度',
    表示名: '表面が濡れる程度',
  },
  '1/3程度': {
    key: '1/3程度',
    表示名: '1/3程度',
  },
  '2/3程度': {
    key: '2/3程度',
    表示名: '2/3程度',
  },
  鉢いっぱい: {
    key: '鉢いっぱい',
    表示名: '鉢いっぱい',
  },
} as const satisfies {
  [Key in string]: {
    key: Key;
    表示名: string;
  };
};
export type _灌水量 = ValueOf<typeof _灌水量>['key'];
