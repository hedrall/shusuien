import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';
import { 日光の強度設定, 鉢 } from '@frontend/domain/model/item';
import { isDefined, optionalValue } from '@frontend/supports/functions';
import { 季節, 現在の季節 } from '@frontend/domain/const/season';
import { NonUndefined } from 'react-hook-form';

export namespace 植物ごとのデフォルト設定サービス {
  /**
   * ここ、かなりわかりにくいので例を書く
   *
   * 例)
   * const { 植物ごとのデフォルト設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();
   * const 設定一覧 = 植物ごとのデフォルト設定サービス.鉢の設定を特定(植物ごとのデフォルト設定一覧, 鉢);
   * const 耐寒温度 = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得の結果(
   *   設定一覧, 鉢, '耐寒温度'
   * )
   */
  type 一致Type = '属種' | '科属' | '属';
  type Item = {
    一致Type: 一致Type;
    デフォルト設定: 植物ごとのデフォルト設定;
  };
  export type 鉢のデフォルト設定 = Item[];
  export const 鉢の設定を特定 = (設定一覧: 植物ごとのデフォルト設定[], 鉢: 鉢): 鉢のデフォルト設定 => {
    const { 科, 属, 種名 } = 鉢.詳細;

    const items: Item[] = [];

    if (種名 && 属) {
      const 属種まで一致 = 設定一覧.find(i => i.属 === 属 && i.種 === 種名);
      if (属種まで一致) items.push({ 一致Type: '属種', デフォルト設定: 属種まで一致 });
    }

    if (科 && 属) {
      const 科属まで一致 = 設定一覧.filter(i => !i.種).find(i => i.科 === 科 && i.属 === 属);
      if (科属まで一致) items.push({ 一致Type: '科属', デフォルト設定: 科属まで一致 });
    } else if (属) {
      const 属だけ一致 = 設定一覧.filter(i => !i.種).find(i => i.属 === 属);
      if (属だけ一致) items.push({ 一致Type: '属', デフォルト設定: 属だけ一致 });
    }
    // (種,科のみで当てるのは意味がなさそう)

    return items;
  };

  type デフォルト直を加味した直の取得の結果<V> = {
    一致Type: 一致Type | '鉢の直を利用' | '一致せず';
    value: V;
    デフォルトを適用: boolean;
  };
  export const デフォルト直を加味した直の取得 = <K extends '耐寒温度' | '水切れ日数' | '育成タイプ'>(
    items: Item[],
    鉢: 鉢,
    key: K,
  ): デフォルト直を加味した直の取得の結果<鉢['詳細'][K]> => {
    const 鉢から = 鉢.詳細[key];
    if (isDefined(鉢から)) {
      return {
        一致Type: '鉢の直を利用',
        value: 鉢から,
        デフォルトを適用: false,
      };
    }
    for (const item of items) {
      const デフォルト設定から = item.デフォルト設定[key];
      if (isDefined(デフォルト設定から)) {
        return {
          一致Type: item.一致Type,
          value: デフォルト設定から,
          デフォルトを適用: true,
        };
      }
    }
    return {
      一致Type: '一致せず',
      value: 鉢から,
      デフォルトを適用: false,
    };
  };
  export const デフォルト直を加味した四季のある直の取得 = <K extends '日光の強度設定', R>(
    items: Item[],
    鉢: 鉢,
    key: K,
    季節: 季節,
  ): デフォルト直を加味した直の取得の結果<NonUndefined<鉢['詳細'][K]>[季節]> => {
    const 鉢から = 鉢.詳細[key]?.[季節];
    if (isDefined(鉢から)) {
      return {
        一致Type: '鉢の直を利用',
        value: 鉢から,
        デフォルトを適用: false,
      };
    }
    for (const item of items) {
      const デフォルト設定から = item.デフォルト設定[key]?.[季節];
      if (isDefined(デフォルト設定から)) {
        return {
          一致Type: item.一致Type,
          value: デフォルト設定から,
          デフォルトを適用: true,
        };
      }
    }
    return {
      一致Type: '一致せず',
      value: 鉢から,
      デフォルトを適用: false,
    };
  };

  export const デフォルト直を適用 = (i: 鉢, デフォルト設定一覧: 植物ごとのデフォルト設定[]) => {
    const 設定一覧 = 植物ごとのデフォルト設定サービス.鉢の設定を特定(デフォルト設定一覧, i);
    const 耐寒温度 = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(設定一覧, i, '耐寒温度').value;
    const 水切れ日数 = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(設定一覧, i, '水切れ日数').value;
    const 今季の日光の強度設定 = 植物ごとのデフォルト設定サービス.デフォルト直を加味した四季のある直の取得(
      設定一覧,
      i,
      '日光の強度設定',
      現在の季節,
    ).value;

    const mod = {
      ...i,
      詳細: {
        ...i.詳細,
        耐寒温度,
        日光の強度設定: {
          ...i.詳細.日光の強度設定,
          [現在の季節]: 今季の日光の強度設定,
        },
        水切れ日数,
      },
    };
    const デフォルトを適用した鉢 = new 鉢(mod);
    return デフォルトを適用した鉢;
  };
}
