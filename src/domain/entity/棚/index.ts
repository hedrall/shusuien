import { Opaque } from 'type-fest';
import { User } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from 'src/domain/repository/firestore';

async function _削除(this: 棚) {
  await FSAppRepository.棚.更新(this.id!, { 削除済み: true });
}

export namespace 棚 {
  export type Id = Opaque<string, '棚ID'>;
  export type Props = {
    id: Id | undefined;
    name: string;
    userId: User.Id;
    作成日時: Dayjs;
    削除済み: boolean;
  };

  export const construct = (props: 棚.Props) => {
    return {
      id: props.id,
      name: props.name,
      userId: props.userId,
      削除済み: !!props.削除済み,
      作成日時: dayjs(props.作成日時),
      削除: _削除,
    };
  };

  export const 新規作成 = async (v: Pick<棚, 'name' | 'userId'>) => {
    const 新規棚 = construct({
      id: undefined,
      作成日時: dayjs(),
      削除済み: false,
      ...v,
    });
    await FSAppRepository.棚.作成(新規棚);
  };

  export const 名前を更新 = async (id: Id, name: string) => {
    await FSAppRepository.棚.更新(id, { name });
  };
}
export type 棚 = ReturnType<typeof 棚.construct>;
