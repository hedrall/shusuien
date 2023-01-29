import { Opaque } from 'type-fest';

export type UserId = Opaque<string, 'UserId'>;
export class User {
  id: UserId;
  名前: string;

  // ルーム
  constructor(props: User) {
    this.id = props.id;
    this.名前 = props.名前;
  }
}
