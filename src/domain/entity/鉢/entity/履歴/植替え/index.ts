import { NewProps, Super履歴, Super履歴Base } from 'src/domain/entity/鉢/entity/履歴/base';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { _鉢サイズ } from 'src/domain/entity/鉢/entity/履歴/植替え/鉢サイズ';

type _植替え履歴Base = Super履歴Base & {
  内容: {
    type: '植替え';
    植替え日時: Dayjs;
    鉢のサイズ: _鉢サイズ;
    植替え後の画像のURL: string;
    memo?: string;
  };
};

export namespace _植替え履歴 {
  export type 鉢サイズ = _鉢サイズ;
}
export class _植替え履歴 extends Super履歴 implements _植替え履歴Base {
  内容: {
    type: '植替え';
    植替え日時: Dayjs;
    鉢のサイズ: _植替え履歴.鉢サイズ;
    植替え後の画像のURL: string;
    memo?: string;
  };

  static 鉢サイズ = _鉢サイズ;

  static create = async (params: NewProps<_植替え履歴Base>) => {
    const { props, 内容 } = params;
    const { 植替え日時, 鉢のサイズ, 植替え後の画像のURL, memo } = 内容;
    const 新規履歴 = new _植替え履歴({
      id: undefined,
      削除済み: false,
      ...props,
      内容: {
        type: '植替え',
        植替え日時,
        鉢のサイズ,
        植替え後の画像のURL,
        memo,
      },
    });
    const { id } = await FSAppRepository.履歴.作成(新規履歴);
    return new _植替え履歴({ ...新規履歴, id });
  };

  constructor(props: _植替え履歴Base) {
    super(props);
    this.内容 = props.内容;
    this.内容.植替え日時 = props.内容.植替え日時 && dayjs(props.内容.植替え日時);
  }
}
