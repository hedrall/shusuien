import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

export type 棚ID = Opaque<string, '棚ID'>;
export class 棚 {
  id: 棚ID | undefined;
  name: string;
  userId: UserId;
  作成日時: Dayjs;

  static async 新規作成(v: Pick<棚, 'name' | 'userId'>) {
    const 新規棚 = new 棚({
      id: undefined,
      作成日時: dayjs(),
      ...v,
    });
    await FSAppRepository.棚.作成(新規棚);
  }

  // ルーム
  constructor(props: 棚) {
    this.id = props.id;
    this.name = props.name;
    this.userId = props.userId;
    this.作成日時 = dayjs(props.作成日時);
  }
}
