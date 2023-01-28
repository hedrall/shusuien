import { Opaque } from "type-fest";

export type 棚ID = Opaque<string, "棚ID">;
export class 棚 {
  id: 棚ID;
  名前: string;
  // ルーム

  constructor(props: 棚) {
    this.id = props.id;
    this.名前 = props.名前;
  }
}
