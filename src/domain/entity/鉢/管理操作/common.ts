import { 鉢 } from 'src/domain/entity/鉢';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { Dayjs } from 'dayjs';

export const update = (cur: 鉢, 更新するsnapshotの項目: Partial<鉢['snapshot']>, 履歴の作成日時: Dayjs) => {
  return new 鉢({
    ...cur,
    snapshot: {
      ...cur.snapshot,
      ...更新するsnapshotの項目,
      更新日時: 履歴の作成日時,
    },
  });
};

// 履歴を新規に追加した際に、鉢の状態(主にsnapshot)に履歴を適用して、状態を最新に更新する
export const _履歴を適用 = (鉢: 鉢, 履歴: 履歴, small画像のURL: string | undefined, 画像を更新する = true) => {
  const type = 履歴.内容.type;
  const common = { ...(画像を更新する && small画像のURL ? { small画像のURL } : {}) };
  switch (type) {
    case '植替え':
      // [更新項目] 鉢サイズ, 最後の植替え, 画像
      return update(
        鉢,
        {
          ...common,
          鉢のサイズ: 履歴.内容.鉢のサイズ,
          最後の植替え: 履歴.内容.植替え日時,
          ...(画像を更新する ? { 画像のURL: 履歴.内容.植替え後の画像のURL } : {}),
        },
        履歴.作成日時,
      );
    case '灌水':
      // [更新項目] 最後の灌水
      return update(
        鉢,
        {
          ...common,
          最後の灌水: {
            日時: 履歴.作成日時,
            量: 履歴.内容.灌水量,
          },
          最後の液肥: { 日時: 履歴.内容.液肥入り ? 履歴.作成日時 : 鉢.snapshot.最後の液肥?.日時 },
        },
        履歴.作成日時,
      );
    case '成長の記録':
      // [更新項目] 画像?
      return update(
        鉢,
        {
          ...common,
          ...(画像を更新する && 履歴.内容.画像のURL ? { 画像のURL: 履歴.内容.画像のURL } : {}),
        },
        履歴.作成日時,
      );
    default:
      throw new Error(`実装されていません。type: ${type}`);
  }
};
