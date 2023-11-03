import { NewProps, Super履歴 } from 'src/domain/entity/鉢/entity/履歴/base';
import { FSAppRepository } from 'src/domain/repository/firestore';

export namespace _成長の記録 {
  export type Props = Super履歴.Props & {
    内容: {
      type: '成長の記録';
      画像のURL: string | undefined;
      memo: string | undefined;
    };
  };

  export const construct = (props: Props) => {
    return {
      ...Super履歴.construct(props),
      ...props,
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

// export class _成長の記録 extends Super履歴 implements _成長の記録Base {
//   内容: {
//     type: '成長の記録';
//     画像のURL: string | undefined;
//     memo: string | undefined;
//   };
//
//
// }
