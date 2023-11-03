import { NewProps, 履歴のBase, 履歴のBaseBase } from 'src/domain/entity/鉢/entity/履歴/base';
import { FSAppRepository } from 'src/domain/repository/firestore';

type _成長の記録Base = 履歴のBaseBase & {
  内容: {
    type: '成長の記録';
    画像のURL: string | undefined;
    memo: string | undefined;
  };
};

export class _成長の記録 extends 履歴のBase implements _成長の記録Base {
  内容: {
    type: '成長の記録';
    画像のURL: string | undefined;
    memo: string | undefined;
  };

  static create = async (params: NewProps<_成長の記録Base>) => {
    const { props, 内容 } = params;
    const 新規履歴 = new _成長の記録({
      id: undefined,
      削除済み: false,
      ...props,
      内容: { type: '成長の記録', ...内容 },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return new _成長の記録({ ...新規履歴, id });
  };

  constructor(props: _成長の記録Base) {
    super(props);
    this.内容 = props.内容;
  }
}
