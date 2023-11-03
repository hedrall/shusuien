import { Opaque } from 'type-fest';
import { UserId } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

export type 棚ID = Opaque<string, '棚ID'>;
export class 棚Base {
  id: 棚ID | undefined;
  name: string;
  userId: UserId;
  作成日時: Dayjs;
  削除済み: boolean;

  // ルーム
  constructor(props: 棚Base) {
    this.id = props.id;
    this.name = props.name;
    this.userId = props.userId;
    this.削除済み = !!props.削除済み;
    this.作成日時 = dayjs(props.作成日時);
  }
}
export class 棚 extends 棚Base {
  async 削除() {
    await FSAppRepository.棚.更新(this.id!, { 削除済み: true });
  }

  static async 新規作成(v: Pick<棚, 'name' | 'userId'>) {
    const 新規棚 = new 棚({
      id: undefined,
      作成日時: dayjs(),
      削除済み: false,
      ...v,
    });
    await FSAppRepository.棚.作成(新規棚);
  }

  static 名前を更新 = async (id: 棚ID, name: string) => {
    await FSAppRepository.棚.更新(id, { name });
  };

  constructor(props: 棚Base) {
    super(props);
  }
}
