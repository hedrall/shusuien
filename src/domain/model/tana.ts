import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';

export type 棚ID = Opaque<string, '棚ID'>;
export class 棚 {
  id: 棚ID;
  名前: string;
  userId: UserId;
  // ルーム

  constructor(props: 棚) {
    this.id = props.id;
    this.名前 = props.名前;
    this.userId = props.userId;
  }
}
