import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';

export type 鉢Id = Opaque<string, '鉢ID'>;
export class 鉢 {
  id: 鉢Id;
  userId: UserId;
  画像のURL: string;
  科?: string;
  属?: string;
  種名?: string;
  補足名?: string;

  constructor(props: 鉢) {
    this.id = props.id;
    this.userId = props.userId;
    this.画像のURL = props.画像のURL;
    this.科 = props.科;
    this.属 = props.属;
    this.補足名 = props.補足名;
  }

  static create = () => {
    /**
     * 1. 鉢を生成するf
     * 2. 画像の更新歴を作成する
     * 3. 鉢の画像を更新する
     */
    // const 鉢 = new 鉢()
    // 画像の更新歴を作成する
  };
}
