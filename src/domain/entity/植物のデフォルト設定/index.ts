import { Opaque } from 'type-fest';
import { Subject } from 'rxjs';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { User } from 'src/domain/entity/user';
import { 鉢 } from 'src/domain/entity/鉢';
import { _ルートプロパティを更新, _日光の強度設定を更新 } from 'src/domain/entity/植物のデフォルト設定/更新';

function getOrder(this: 植物ごとのデフォルト設定) {
  return [this.科, this.属, this.種].filter(Boolean).join('-');
}

export namespace 植物ごとのデフォルト設定 {
  export type Id = Opaque<string, '植物ごとのデフォルト設定'>;

  export type Props = {
    id: Id | undefined;
    userId: User.Id;
    科: string | undefined;
    属: string | undefined;
    種: string | undefined;
    育成タイプ?: 鉢.育成タイプ;
    水切れ日数: number | undefined;
    order: string;
  } & 鉢.デフォルト設定可能な鉢のプロパティ;

  export const construct = (props: Omit<Props, 'order'>) => {
    return {
      id: props.id,
      userId: props.userId,
      科: props.科,
      属: props.属,
      種: props.種,
      育成タイプ: props.育成タイプ,
      耐寒温度: props.耐寒温度,
      水切れ日数: props.水切れ日数,
      日光の強度設定: props.日光の強度設定,
      order: getOrder,

      ルートプロパティを更新: _ルートプロパティを更新,
      日光の強度設定を更新: _日光の強度設定を更新,
    };
  };

  export const events = {
    作成: new Subject<void>(),
  };

  export const 作成 = async (props: Omit<Props, 'id' | 'order'>) => {
    const 設定 = construct({
      ...props,
      id: undefined,
    });
    await FSAppRepository.植物ごとのデフォルト設定.作成(設定);
    植物ごとのデフォルト設定.events.作成.next();
  };
}
export type 植物ごとのデフォルト設定 = ReturnType<typeof 植物ごとのデフォルト設定.construct>;
