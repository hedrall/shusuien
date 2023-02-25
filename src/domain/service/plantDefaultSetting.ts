import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';
import { 日光の強度設定, 鉢 } from '@frontend/domain/model/item';
import { optionalValue } from '@frontend/supports/functions';
import { 季節 } from '@frontend/domain/const/season';

export namespace 植物ごとのデフォルト設定サービス {
  type Res =
    | {
        一致Type: '属種';
        デフォルト設定: 植物ごとのデフォルト設定;
      }
    | {
        一致Type: '科属';
        デフォルト設定: 植物ごとのデフォルト設定;
      }
    | {
        一致Type: '一致なし';
        デフォルト設定: undefined;
      };
  export const 鉢の設定を特定 = (設定一覧: 植物ごとのデフォルト設定[], 鉢: 鉢): Res => {
    const { 科, 属, 種名 } = 鉢.詳細;

    if (種名 && 属) {
      const 属種まで一致 = 設定一覧.find(i => i.属 === 属 && i.種 === 種名);
      if (属種まで一致) return { 一致Type: '属種', デフォルト設定: 属種まで一致 };
    }

    if (科 && 属) {
      const 科属まで一致 = 設定一覧.filter(i => !i.種).find(i => i.科 === 科 && i.属 === 属);
      if (科属まで一致) return { 一致Type: '科属', デフォルト設定: 科属まで一致 };
    }

    // 科のみで当てるのは意味がなさそう
    return { 一致Type: '一致なし', デフォルト設定: undefined };
  };

  export const デフォルト直を適用 = (i: 鉢, デフォルト設定一覧: 植物ごとのデフォルト設定[]) => {
    const { デフォルト設定, 一致Type } = 植物ごとのデフォルト設定サービス.鉢の設定を特定(デフォルト設定一覧, i);
    const mod = {
      ...i,
      詳細: {
        ...i.詳細,
        耐寒温度: optionalValue(i.詳細.耐寒温度, optionalValue(デフォルト設定?.耐寒温度, undefined)),
        日光の強度設定: Object.values(季節).reduce((pre, 季節) => {
          return {
            ...pre,
            [季節]: optionalValue(
              i.詳細.日光の強度設定?.[季節],
              optionalValue(デフォルト設定?.日光の強度設定?.[季節], undefined),
            ),
          };
        }, 日光の強度設定.Default),
        水切れ日数: optionalValue(i.詳細.水切れ日数, optionalValue(デフォルト設定?.水切れ日数, undefined)),
      },
    };
    return {
      デフォルトを適用した鉢: new 鉢(mod),
      一致Type,
    };
  };
}
