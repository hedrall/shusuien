import { Dayjs } from 'dayjs';
import { 棚ID } from '@frontend/domain/model/tana';
import { 鉢Id } from '@frontend/domain/model/item';
import { Opaque, ValueOf } from 'type-fest';

type 履歴ID = Opaque<string, '履歴ID'>;

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

  export type 履歴クラス = 灌水 | 画像を更新;
  export type Type = 履歴クラス['type'];
}
export type 履歴の内容 = 履歴の内容.灌水 | 履歴の内容.画像を更新;

export class 履歴 {
  id: 履歴ID;
  日時: Dayjs;
  対象の棚のID: 棚ID | undefined;
  対象の鉢のID: 鉢Id | undefined;
  内容: 履歴の内容;

  constructor(props: 履歴) {
    this.id = props.id;
    this.日時 = props.日時;
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
}
export namespace 履歴 {
  export type 灌水 = 履歴 & { 内容: 履歴の内容.灌水 };
  export type 画像を更新 = 履歴 & { 内容: 履歴の内容.画像を更新 };
}
