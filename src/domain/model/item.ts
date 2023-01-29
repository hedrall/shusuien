import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';

export type 鉢Id = Opaque<string, '鉢ID'>;
export class 鉢 {
  id: 鉢Id;
  photoUrl: string;
  userId: UserId;

  constructor(props: 鉢) {
    this.id = props.id;
    this.photoUrl = props.photoUrl;
    this.userId = props.userId;
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
