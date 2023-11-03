import { NewProps, Super履歴, Super履歴Base } from 'src/domain/entity/鉢/entity/履歴/base';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { 履歴の内容 } from 'src/domain/entity/鉢/entity/履歴';
import { _灌水量 } from 'src/domain/entity/鉢/entity/履歴/灌水/灌水量';

type _灌水履歴Base = Super履歴Base & {
  内容: {
    type: '灌水';
    灌水量: 履歴の内容.灌水.量のKey型;
    液肥入り: boolean | undefined;
  };
};

export namespace _灌水履歴 {
  export type 灌水量 = _灌水量;
}
export class _灌水履歴 extends Super履歴 implements _灌水履歴Base {
  内容: {
    type: '灌水';
    灌水量: 履歴の内容.灌水.量のKey型;
    液肥入り: boolean | undefined;
  };

  static 灌水量 = _灌水量;

  static create = async (params: NewProps<_灌水履歴Base>) => {
    const { props, 内容 } = params;
    const { 灌水量, 液肥入り } = 内容;
    const 新規履歴 = new _灌水履歴({
      id: undefined,
      削除済み: false,
      ...props,
      内容: { type: '灌水', 灌水量, 液肥入り },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return new _灌水履歴({ ...新規履歴, id });
  };

  constructor(props: _灌水履歴Base) {
    super(props);
    this.内容 = props.内容;
  }
}
