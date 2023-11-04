import { NewProps, 履歴Base } from 'src/domain/entity/鉢/entity/履歴/base';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { Opaque } from 'type-fest';

export namespace _成長の記録 {
  export type Id = Opaque<string, '成長の記録ID'>;

  export type Props = 履歴Base.Props & {
    id: Id | undefined;
    内容: {
      type: '成長の記録';
      画像のURL: string | undefined;
      memo: string | undefined;
    };
  };

  export const construct = (props: Props) => {
    return {
      ...履歴Base.construct(props),
      id: props.id,
      内容: {
        ...props.内容,
      },
    } as const;
  };

  export const create = async (params: NewProps<Props>) => {
    const { props, 内容 } = params;
    const 新規履歴 = construct({
      id: undefined,
      削除済み: false,
      ...props,
      内容: { type: '成長の記録', ...内容 },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return construct({ ...新規履歴, id });
  };
}
export type _成長の記録 = ReturnType<typeof _成長の記録.construct>;
