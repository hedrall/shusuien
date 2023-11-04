import { NewProps, 履歴Base } from 'src/domain/entity/鉢/entity/履歴/base';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { Opaque } from 'type-fest';

export namespace _植替待設定履歴 {
  export type Id = Opaque<string, '植替待設定履歴ID'>;
  export type Props = 履歴Base.Props & {
    id: Id | undefined;
    内容: {
      type: '植替待設定';
    };
  };

  // constructor
  export const construct = (props: Props) => {
    return {
      ...履歴Base.construct(props),
      id: props.id,
      内容: props.内容,
    } as const;
  };

  // factory
  export const create = async (props: NewProps<Props>['props']) => {
    const 新規履歴 = construct({
      id: undefined,
      削除済み: false,
      ...props,
      内容: { type: '植替待設定' },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return construct({ ...新規履歴, id });
  };
}
export type _植替待設定履歴 = ReturnType<typeof _植替待設定履歴.construct>;
