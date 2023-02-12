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

export type 鉢Id = Opaque<string, '鉢ID'>;

type Snapshot = {
  鉢のサイズ?: 鉢サイズ;
  最後の植替え?: Dayjs;
  最後の灌水?: {
    日時: Dayjs;
    量: 履歴の内容.灌水.量のKey型;
  };
  画像のPATH?: string;
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
  };
  補足?: string;
  // 履歴を畳み込んで得られるもの
  snapshot: Snapshot;
  作成日時: Dayjs;

  constructor(props: 鉢のBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.棚Id = props.棚Id;
    this.snapshot = {
      鉢のサイズ: props.snapshot.鉢のサイズ,
      最後の植替え: optionalCall(props.snapshot.最後の植替え, dayjs),
      画像のPATH: props.snapshot.画像のPATH,
      更新日時: dayjs(props.snapshot.更新日時),
    };
    const snapshot = this.snapshot;
    if ('最後の灌水' in snapshot) {
      this.snapshot.最後の灌水 = {
        日時: dayjs(snapshot.最後の灌水!.日時),
        量: snapshot.最後の灌水!.量,
      };
    }
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      種名: props.詳細.種名,
    };
    this.補足 = props.補足;
    this.作成日時 = dayjs(props.作成日時);
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

function _履歴を適用(this: 鉢, 履歴: 履歴) {
  const type = 履歴.内容.type;
  switch (type) {
    case '植替え':
      // [更新項目] 鉢サイズ, 最後の植替え, 画像
      return update(
        this,
        {
          鉢のサイズ: 履歴.内容.鉢のサイズ,
          最後の植替え: 履歴.内容.植替え日時,
          画像のPATH: 履歴.内容.植替え後の画像のPATH,
        },
        履歴.作成日時,
      );
    case '灌水':
      // [更新項目] 最後の灌水
      return update(
        this,
        {
          最後の灌水: {
            日時: 履歴.作成日時,
            量: 履歴.内容.灌水量,
          },
        },
        履歴.作成日時,
      );
    default:
      throw new Error(`実装されていません。type: ${type}`);
  }
}

export class 鉢 extends 鉢のBase {
  履歴を適用 = _履歴を適用;

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
