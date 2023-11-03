import { NewProps, Super履歴 } from 'src/domain/entity/鉢/entity/履歴/base';
import { _灌水量 } from 'src/domain/entity/鉢/entity/履歴/灌水/灌水量';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { Opaque } from 'type-fest';

export namespace _灌水履歴 {
  export const 灌水量 = _灌水量;
  export type 灌水量 = _灌水量;

  export type Id = Opaque<string, '灌水履歴ID'>;
  export type Props = Super履歴.Props & {
    id: Id | undefined;
    内容: {
      type: '灌水';
      灌水量: _灌水量;
      液肥入り: boolean | undefined;
    };
  };

  // constructor
  export const construct = (props: Props) => {
    return {
      ...Super履歴.construct(props),
      id: props.id,
      内容: props.内容,
    } as const;
  };

  // factory
  export const create = async (params: NewProps<Props>) => {
    const { props, 内容 } = params;
    const { 灌水量, 液肥入り } = 内容;
    const 新規履歴 = construct({
      id: undefined,
      削除済み: false,
      ...props,
      内容: { type: '灌水', 灌水量, 液肥入り },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return construct({ ...新規履歴, id });
  };
}
export type _灌水履歴 = ReturnType<typeof _灌水履歴.construct>;
