import { Opaque } from "type-fest";

export type 鉢Id = Opaque<string, "鉢ID">;
export class 鉢 {
  id: 鉢Id;
  photoUrl: string;

  constructor(props: 鉢) {
    this.id = props.id;
    this.photoUrl = props.photoUrl;
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
