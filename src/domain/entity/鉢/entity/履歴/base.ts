import { UserId } from 'src/domain/entity/user';
import { 棚ID } from 'src/domain/entity/棚';
import { 鉢 } from 'src/domain/entity/鉢';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴, 履歴ID } from 'src/domain/entity/鉢/entity/履歴/index';
import { _灌水履歴 } from 'src/domain/entity/鉢/entity/履歴/灌水';
import { _成長の記録 } from 'src/domain/entity/鉢/entity/履歴/成長の記録';
import { _植替え履歴 } from 'src/domain/entity/鉢/entity/履歴/植替え';

export abstract class 履歴のBaseBase {
  id: 履歴ID | undefined;
  userId: UserId;
  対象の棚のID: 棚ID | undefined;
  対象の鉢のID: 鉢.Id | undefined;
  作成日時: Dayjs;
  削除済み: boolean;
  内容: object & { type: string };

  protected constructor(props: 履歴のBaseBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.作成日時 = dayjs(props.作成日時);
    this.対象の棚のID = props.対象の棚のID;
    this.対象の鉢のID = props.対象の鉢のID;
    this.削除済み = props.削除済み;
    this.内容 = props.内容;
  }
}

export abstract class 履歴のBase extends 履歴のBaseBase {
  is灌水(this: 履歴のBase): this is _灌水履歴 {
    return this.内容.type === '灌水';
  }

  is成長の記録(this: 履歴のBase): this is _成長の記録 {
    return this.内容.type === '成長の記録';
  }

  is植替え(this: 履歴のBase): this is _植替え履歴 {
    return this.内容.type === '植替え';
  }

  constructor(props: 履歴のBaseBase) {
    super(props);
  }
}

export type NewProps<履歴Base extends object & { 内容: object }> = {
  props: Omit<履歴Base, 'id' | '内容' | '削除済み'>;
  内容: Omit<履歴Base['内容'], 'type'>;
};
