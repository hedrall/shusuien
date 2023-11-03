import { NewProps, Super履歴 } from 'src/domain/entity/鉢/entity/履歴/base';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { _鉢サイズ } from 'src/domain/entity/鉢/entity/履歴/植替え/鉢サイズ';
import { Opaque } from 'type-fest';

export namespace _植替え履歴 {
  export import 鉢サイズ = _鉢サイズ;

  export type Id = Opaque<string, '植替え履歴ID'>;
  export type Props = Super履歴.Props & {
    id: Id | undefined;
    内容: {
      type: '植替え';
      植替え日時: Dayjs;
      鉢のサイズ: _鉢サイズ;
      植替え後の画像のURL: string;
      memo?: string;
    };
  };

  // constructor
  export const construct = (props: Props) => {
    return {
      ...Super履歴.construct(props),
      ...props,
      内容: {
        ...props.内容,
        植替え日時: props.内容.植替え日時 && dayjs(props.内容.植替え日時),
      },
    } as const;
  };

  // factory
  export const create = async (params: NewProps<Props>) => {
    const { props, 内容 } = params;
    const { 植替え日時, 鉢のサイズ, 植替え後の画像のURL, memo } = 内容;
    const 新規履歴 = construct({
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
    return construct({ ...新規履歴, id });
  };
}
export type _植替え履歴 = ReturnType<typeof _植替え履歴.construct>;
