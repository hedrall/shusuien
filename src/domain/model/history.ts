import dayjs, { Dayjs } from 'dayjs';
import { 棚ID } from '@frontend/domain/model/tana';
import { 鉢Id } from '@frontend/domain/model/item';
import { Opaque, ValueOf } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { tObjectKeys } from '@frontend/supports/functions';

export type 履歴ID = Opaque<string, '履歴ID'>;

export namespace 鉢サイズ {
  export const 番号 = ['2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5'];
  export type 番号 = typeof 番号[number];

  export const タイプ = ['通常', 'L'];
  export type タイプ = typeof タイプ[number];

  export const toString = (size: 鉢サイズ) => {
    const postfix = size.タイプ === '通常' ? '' : ` ${size.タイプ}`;
    return `${size.番号}号${postfix}`;
  };
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
    } as const satisfies {
      [Key in string]: {
        key: Key;
        表示名: string;
      };
    };
    export type 量のKey型 = ValueOf<typeof 量の定義>['key'];
    export const 量のKey = Object.values(量の定義).map(i => i.key);
  }
  export type 灌水 = {
    type: '灌水';
    灌水量: 灌水.量のKey型;
  };

  // 成長の記録
  export type 成長の記録 = {
    type: '成長の記録';
    画像のURL: string | undefined;
    memo: string | undefined;
  };

  // 植替え
  export type 植替え = {
    type: '植替え';
    植替え日時: Dayjs;
    鉢のサイズ: 鉢サイズ;
    植替え後の画像のURL: string;
    memo?: string;
  };

  export type 一覧 = 灌水 | 成長の記録 | 植替え;
  export type Type = 一覧['type'];
  export const Type = tObjectKeys({
    灌水: undefined,
    成長の記録: undefined,
    植替え: undefined,
  } as const satisfies { [Key in Type]: undefined });
}
export type 履歴の内容 = 履歴の内容.一覧;

type NewBaseProps = Omit<履歴のBase, 'id' | '内容'>;
export type New内容Props<T extends 履歴の内容> = Omit<T, 'type'>;
type NewProps<T extends 履歴の内容> = {
  props: NewBaseProps;
  内容: New内容Props<T>;
};

const 作成 = async (新規履歴: 履歴) => {
  const { id } = await FSAppRepository.履歴.作成(新規履歴);
  return new 履歴({ ...新規履歴, id });
};

const _成長の記録履歴を作成 = async (params: NewProps<履歴の内容.成長の記録>) => {
  const { props, 内容 } = params;
  const 新規履歴 = new 履歴({
    id: undefined,
    ...props,
    内容: {
      type: '成長の記録',
      ...内容,
    },
  });
  return await 作成(新規履歴);
};

const _植替え履歴を作成 = async (params: NewProps<履歴の内容.植替え>) => {
  const { props, 内容 } = params;
  const { 植替え日時, 鉢のサイズ, 植替え後の画像のURL, memo } = 内容;
  const 新規履歴 = new 履歴({
    id: undefined,
    ...props,
    内容: {
      type: '植替え',
      植替え日時,
      鉢のサイズ,
      植替え後の画像のURL,
      memo,
    },
  });
  return await 作成(新規履歴);
};

const _灌水履歴を作成 = async (params: NewProps<履歴の内容.灌水>) => {
  const { props, 内容 } = params;
  const { 灌水量 } = 内容;
  const 新規履歴 = new 履歴({
    id: undefined,
    ...props,
    内容: {
      type: '灌水',
      灌水量,
    },
  });
  return await 作成(新規履歴);
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
    this.作成日時 = dayjs(props.作成日時);
    this.対象の棚のID = props.対象の棚のID;
    this.対象の鉢のID = props.対象の鉢のID;

    this.内容 = props.内容;
    if ('植替え日時' in this.内容) {
      this.内容['植替え日時'] = dayjs(this.内容['植替え日時']);
    }
  }
}
export class 履歴 extends 履歴のBase {
  constructor(props: 履歴のBase) {
    super(props);
  }

  is灌水(this: 履歴): this is 履歴.灌水 {
    return this.内容.type === '灌水';
  }
  is成長の記録(this: 履歴): this is 履歴.成長の記録 {
    return this.内容.type === '成長の記録';
  }
  is植替え(this: 履歴): this is 履歴.植替え {
    return this.内容.type === '植替え';
  }

  static 新規作成 = {
    成長記録: _成長の記録履歴を作成,
    植替え: _植替え履歴を作成,
    灌水: _灌水履歴を作成,
  };
}
export namespace 履歴 {
  export type 灌水 = 履歴 & { 内容: 履歴の内容.灌水 };
  export type 成長の記録 = 履歴 & { 内容: 履歴の内容.成長の記録 };
  export type 植替え = 履歴 & { 内容: 履歴の内容.植替え };
}
