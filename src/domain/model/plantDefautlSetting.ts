import { Opaque } from 'type-fest';
import { 日光の強度設定, 鉢 } from '@frontend/domain/model/item';
import { Subject } from 'rxjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { UserId } from '@frontend/domain/model/user';

function getOrder(i: 植物ごとのデフォルト設定) {
  return [i.科, i.属, i.種].filter(Boolean).join('-');
}
export type 植物ごとのデフォルト設定Id = Opaque<string, '植物ごとのデフォルト設定'>;
export class 植物ごとのデフォルト設定 implements 鉢.デフォルト設定可能な鉢のプロパティ {
  id: 植物ごとのデフォルト設定Id | undefined;
  userId: UserId;
  科: string | undefined;
  属: string | undefined;
  種: string | undefined;
  耐寒温度?: number;
  日光の強度設定?: 日光の強度設定;
  order: string;

  // ルーム
  constructor(props: Omit<植物ごとのデフォルト設定, 'order'>) {
    this.id = props.id;
    this.userId = props.userId;
    this.科 = props.科;
    this.属 = props.属;
    this.種 = props.種;
    this.耐寒温度 = props.耐寒温度;
    this.日光の強度設定 = props.日光の強度設定;
    this.order = getOrder(this);
  }

  static events = {
    作成: new Subject<void>(),
  };

  static 作成 = async (props: Omit<植物ごとのデフォルト設定, 'id' | 'order'>) => {
    const 設定 = new 植物ごとのデフォルト設定({
      ...props,
      id: undefined,
    });
    await FSAppRepository.植物ごとのデフォルト設定.作成(設定);
    植物ごとのデフォルト設定.events.作成.next();
  };
}
