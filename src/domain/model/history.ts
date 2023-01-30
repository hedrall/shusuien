import { Dayjs } from 'dayjs';
import { 棚ID } from '@frontend/domain/model/tana';
import { 鉢Id } from '@frontend/domain/model/item';
import { Opaque, ValueOf } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';

type 履歴ID = Opaque<string, '履歴ID'>;

type 鉢サイズのKey = `${2 | 3 | 4 | 5}${'号' | '号 L' | '.5号' | '.5号 L'}`;
type 鉢サイズの型 = { name: 鉢サイズのKey; 表示名: string };
export const 鉢のサイズ = [2, 3, 4, 5].reduce<{ [key in 鉢サイズのKey]: 鉢サイズの型 }>((pre, num) => {
  return {
    ...pre,
    [`${num}号`]: {
      name: `${num}号`,
      表示名: `${num}号`,
    },
    [`${num}号 L`]: {
      name: `${num}号 L`,
      表示名: `${num}号 L`,
    },
    [`${num}.5号`]: {
      name: `${num}.5号`,
      表示名: `${num}.5号`,
    },
    [`${num}.5号 L`]: {
      name: `${num}.5号 L`,
      表示名: `${num}.5号 L`,
    },
  } as const;
}, {} as any);

export namespace 履歴の内容 {
  // 灌水履歴
  export namespace 灌水 {
    export const 量の定義 = {
      表面が濡れる程度: {
        key: '表面が濡れる程度',
        表示名: '表面が濡れる程度',
      },
      ['1/3程度']: {
        key: '1/3程度',
        表示名: '1/3程度',
      },
      ['2/3程度']: {
        key: '2/3程度',
        表示名: '2/3程度',
      },
      ['鉢いっぱい']: {
        key: '鉢いっぱい',
        表示名: '鉢いっぱい',
      },
      ['流れ出るくらい']: {
        key: '流れ出るくらい',
        表示名: '流れ出るくらい',
      },
    } as const;
    export type 量のKey型 = ValueOf<typeof 量の定義>['key'];
    export const 量のKey = Object.values(量の定義).map(i => i.key);
  }
  export type 灌水 = {
    type: '灌水';
    灌水量: 灌水.量のKey型;
  };

  // 画像の撮影
  export type 画像を更新 = {
    type: '画像を更新';
    画像のURL: string;
  };

  // 成長の記録
  export type 成長の記録 = {
    type: '成長の記録';
    memo: string;
    画像のURL: string;
  };

  // 植替え
  export type 植替え = {
    type: '植替え';
    memo: string;
    鉢のサイズのKey: 鉢サイズのKey;
  };

  export type 一覧 = 灌水 | 画像を更新 | 成長の記録 | 植替え;
  export type Type = 一覧['type'];
}
export type 履歴の内容 = 履歴の内容.一覧;

export class 履歴 {
  id: 履歴ID;
  userId: UserId;
  datetime: Dayjs;
  対象の棚のID: 棚ID | undefined;
  対象の鉢のID: 鉢Id | undefined;
  内容: 履歴の内容;

  constructor(props: 履歴) {
    this.id = props.id;
    this.userId = props.userId;
    this.datetime = props.datetime;
    this.対象の棚のID = props.対象の棚のID;
    this.対象の鉢のID = props.対象の鉢のID;
    this.内容 = props.内容;
  }

  is灌水(this: 履歴): this is 履歴.灌水 {
    return this.内容.type === '灌水';
  }
  is画像を更新(this: 履歴): this is 履歴.画像を更新 {
    return this.内容.type === '画像を更新';
  }
  is成長の記録(this: 履歴): this is 履歴.成長の記録 {
    return this.内容.type === '成長の記録';
  }
  is植替え(this: 履歴): this is 履歴.植替え {
    return this.内容.type === '植替え';
  }
}
export namespace 履歴 {
  export type 灌水 = 履歴 & { 内容: 履歴の内容.灌水 };
  export type 画像を更新 = 履歴 & { 内容: 履歴の内容.画像を更新 };
  export type 成長の記録 = 履歴 & { 内容: 履歴の内容.成長の記録 };
  export type 植替え = 履歴 & { 内容: 履歴の内容.植替え };
}
