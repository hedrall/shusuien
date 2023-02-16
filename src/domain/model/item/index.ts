import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴, 履歴の内容, 鉢サイズ } from '@frontend/domain/model/history';
import { 棚ID } from '@frontend/domain/model/tana';
import { optionalCall } from '@frontend/supports/functions';
import { _植替えする } from '@frontend/domain/model/item/operation/replant';
import { _新規作成する } from '@frontend/domain/model/item/operation/newItem';
import { _灌水する } from '@frontend/domain/model/item/operation/provideWater';
import { _成長を記録する } from '@frontend/domain/model/item/operation/docGrowth';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

export type 鉢Id = Opaque<string, '鉢ID'>;

type Snapshot = {
  鉢のサイズ?: 鉢サイズ;
  最後の植替え?: Dayjs;
  最後の灌水?: {
    日時: Dayjs;
    量: 履歴の内容.灌水.量のKey型;
  };
  画像のURL?: string;
  small画像のURL?: string;
  更新日時: Dayjs;
};

export class 鉢のBase {
  id: 鉢Id | undefined;
  userId: UserId;
  name: string | undefined;
  棚Id: 棚ID;
  詳細: {
    科?: string;
    属?: string;
    種名?: string;
    入手元?: string;
    金額?: number;
  };
  補足?: string;
  // 履歴を畳み込んで得られるもの
  snapshot: Snapshot;
  作成日時: Dayjs;
  削除済み: boolean;

  constructor(props: 鉢のBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.棚Id = props.棚Id;
    this.snapshot = {
      鉢のサイズ: props.snapshot.鉢のサイズ,
      最後の植替え: optionalCall(props.snapshot.最後の植替え, dayjs),
      最後の灌水: optionalCall(props.snapshot.最後の灌水, v => ({
        日時: dayjs(v.日時),
        量: v.量,
      })),
      画像のURL: props.snapshot.画像のURL,
      small画像のURL: props.snapshot.small画像のURL,
      更新日時: dayjs(props.snapshot.更新日時),
    };
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      種名: props.詳細.種名,
      入手元: props.詳細.入手元,
      金額: props.詳細.金額,
    };
    this.補足 = props.補足;
    this.作成日時 = dayjs(props.作成日時);
    this.削除済み = props.削除済み;
  }
}

const update = (cur: 鉢, 更新するsnapshotの項目: Partial<鉢['snapshot']>, 履歴の作成日時: Dayjs) => {
  return new 鉢({
    ...cur,
    snapshot: {
      ...cur.snapshot,
      ...更新するsnapshotの項目,
      更新日時: 履歴の作成日時,
    },
  });
};

function _履歴を適用(this: 鉢, 履歴: 履歴, small画像のURL: string | undefined) {
  const type = 履歴.内容.type;
  const common = { ...(small画像のURL ? { small画像のURL } : {}) };
  switch (type) {
    case '植替え':
      // [更新項目] 鉢サイズ, 最後の植替え, 画像
      return update(
        this,
        {
          ...common,
          鉢のサイズ: 履歴.内容.鉢のサイズ,
          最後の植替え: 履歴.内容.植替え日時,
          画像のURL: 履歴.内容.植替え後の画像のURL,
        },
        履歴.作成日時,
      );
    case '灌水':
      // [更新項目] 最後の灌水
      return update(
        this,
        {
          ...common,
          最後の灌水: {
            日時: 履歴.作成日時,
            量: 履歴.内容.灌水量,
          },
        },
        履歴.作成日時,
      );
    case '成長の記録':
      // [更新項目] 画像?
      return update(
        this,
        {
          ...common,
          ...(履歴.内容.画像のURL ? { 画像のURL: 履歴.内容.画像のURL } : {}),
        },
        履歴.作成日時,
      );
    default:
      throw new Error(`実装されていません。type: ${type}`);
  }
}

async function _削除(this: 鉢) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, { 削除済み: true });
}

async function _詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(this: 鉢, key: Key, value: V) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, {
    [`詳細.${key}`]: value,
  });
}

async function _フィールドを更新<Key extends 'name' | '補足', V = 鉢[Key]>(this: 鉢, key: Key, value: V) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, {
    [key]: value,
  });
}

export class 鉢 extends 鉢のBase {
  履歴を適用 = _履歴を適用;

  削除 = _削除;
  詳細を更新 = _詳細を更新;
  フィールドを更新 = _フィールドを更新;

  static 管理 = {
    新規作成: _新規作成する,
    植替え: _植替えする,
    灌水: _灌水する,
    成長を記録: _成長を記録する,
  };

  constructor(props: 鉢のBase) {
    super(props);
  }

  static create = () => {
    /**
     * 1. 鉢を生成するf
     * 2. 画像の更新歴を作成する
     * 3. 鉢の画像を更新する
     */
    // const 鉢 = new 鉢()
    // 画像の更新歴を作成する
  };
}

type _S = Snapshot;
namespace 鉢 {
  export type Snapshot = _S;
}
