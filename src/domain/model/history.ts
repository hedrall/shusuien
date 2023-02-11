import dayjs, { Dayjs } from 'dayjs';
import { 棚ID } from '@frontend/domain/model/tana';
import { 鉢Id } from '@frontend/domain/model/item';
import { Opaque, ValueOf } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

export type 履歴ID = Opaque<string, '履歴ID'>;

export namespace 鉢サイズ {
  export const 番号 = ['2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5'];
  export type 番号 = typeof 番号[number];

  export const タイプ = ['通常', 'L'];
  export type タイプ = typeof タイプ[number];
}
export type 鉢サイズ = {
  番号: 鉢サイズ.番号;
  タイプ: 鉢サイズ.タイプ;
};

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
    画像のPATH: string;
  };

  // 成長の記録
  export type 成長の記録 = {
    type: '成長の記録';
    memo: string;
    画像のPATH: string;
  };

  // 植替え
  export type 植替え = {
    type: '植替え';
    植替え日時: Dayjs;
    鉢のサイズ: 鉢サイズ;
    植替え後の画像のPATH: string;
    memo?: string;
  };

  export type 一覧 = 灌水 | 画像を更新 | 成長の記録 | 植替え;
  export type Type = 一覧['type'];
}
export type 履歴の内容 = 履歴の内容.一覧;

type NewBaseProps = Omit<履歴のBase, 'id' | '作成日時' | '内容'>;
type New内容Props<T extends 履歴の内容> = Omit<T, 'type'>;
type NewProps<T extends 履歴の内容> = {
  props: NewBaseProps;
  内容: New内容Props<T>;
};
export class 履歴のBase {
  id: 履歴ID | undefined;
  userId: UserId;
  対象の棚のID: 棚ID | undefined;
  対象の鉢のID: 鉢Id | undefined;
  内容: 履歴の内容;
  作成日時: Dayjs;

  constructor(props: 履歴のBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.作成日時 = props.作成日時;
    this.対象の棚のID = props.対象の棚のID;
    this.対象の鉢のID = props.対象の鉢のID;
    this.内容 = props.内容;
  }
}
export class 履歴 extends 履歴のBase {
  constructor(props: 履歴のBase) {
    super(props);
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

  static 新規作成 = {
    画像の更新歴: async (params: NewProps<履歴の内容.画像を更新>) => {
      const { props, 内容 } = params;
      const 新規履歴 = new 履歴({
        id: undefined,
        作成日時: dayjs(),
        ...props,
        内容: {
          type: '画像を更新',
          ...内容,
        },
      });
      const { id } = await FSAppRepository.履歴.作成(新規履歴);
      return new 履歴({ ...新規履歴, id });
    },
  };
}
export namespace 履歴 {
  export type 灌水 = 履歴 & { 内容: 履歴の内容.灌水 };
  export type 画像を更新 = 履歴 & { 内容: 履歴の内容.画像を更新 };
  export type 成長の記録 = 履歴 & { 内容: 履歴の内容.成長の記録 };
  export type 植替え = 履歴 & { 内容: 履歴の内容.植替え };
}
