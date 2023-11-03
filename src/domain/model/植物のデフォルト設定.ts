import { Opaque } from 'type-fest';
import { 育成タイプ, 鉢 } from '@frontend/domain/model/鉢';
import { Subject } from 'rxjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { UserId } from '@frontend/domain/model/user';
import { 季節 } from '@frontend/domain/const/季節';
import { 日光の強度設定 } from 'src/domain/model/鉢/日光の強度設定';

function getOrder(i: Base) {
  return [i.科, i.属, i.種].filter(Boolean).join('-');
}
export type 植物ごとのデフォルト設定Id = Opaque<string, '植物ごとのデフォルト設定'>;
export namespace 植物ごとのデフォルト設定 {
  export type 更新可能なプロパティ = '耐寒温度' | `日光の強度設定`;
}
class Base implements 鉢.デフォルト設定可能な鉢のプロパティ {
  id: 植物ごとのデフォルト設定Id | undefined;
  userId: UserId;
  科: string | undefined;
  属: string | undefined;
  種: string | undefined;
  育成タイプ?: 育成タイプ;
  耐寒温度?: number;
  水切れ日数?: number;
  日光の強度設定?: 日光の強度設定;
  order: string;

  // ルーム
  constructor(props: Omit<Base, 'order'>) {
    this.id = props.id;
    this.userId = props.userId;
    this.科 = props.科;
    this.属 = props.属;
    this.種 = props.種;
    this.育成タイプ = props.育成タイプ;
    this.耐寒温度 = props.耐寒温度;
    this.水切れ日数 = props.水切れ日数;
    this.日光の強度設定 = props.日光の強度設定;
    this.order = getOrder(this);
  }
}
export class 植物ごとのデフォルト設定 extends Base {
  constructor(props: Omit<Base, 'order'>) {
    super(props);
  }

  static events = {
    作成: new Subject<void>(),
  };

  static 作成 = async (props: Omit<Base, 'id' | 'order'>) => {
    const 設定 = new 植物ごとのデフォルト設定({
      ...props,
      id: undefined,
    });
    await FSAppRepository.植物ごとのデフォルト設定.作成(設定);
    植物ごとのデフォルト設定.events.作成.next();
  };

  更新 = {
    ルートプロパティ: async <
      Key extends Extract<keyof 植物ごとのデフォルト設定, '育成タイプ' | '耐寒温度' | '水切れ日数'>,
    >(
      key: Key,
      value: 植物ごとのデフォルト設定[Key],
    ) => {
      console.log('ルートプロパティ', { key, value });
      await FSAppRepository.植物ごとのデフォルト設定.更新(this.id!, { [key]: value });
    },
    日光の強度設定: async (value: 日光の強度設定[季節], 季節: 季節) => {
      await FSAppRepository.植物ごとのデフォルト設定.更新(this.id!, {
        [`日光の強度設定.${季節}`]: value,
      });
    },
  };
}
