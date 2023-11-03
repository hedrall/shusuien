import { Opaque } from 'type-fest';

export type UserId = Opaque<string, 'UserId'>;
export class User {
  id: UserId;
  name: string;

  // ルーム
  constructor(props: User) {
    this.id = props.id;
    this.name = props.name;
  }

  static createDefault = (id: string) => {
    return new User({
      id: id as UserId,
      name: '名前未設定',
    });
  };
}
