import { UserId } from '@frontend/domain/model/user';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 棚, 棚ID } from 'src/domain/model/棚';
import { BehaviorSubject } from 'rxjs';

export class 棚の並び順Base {
  id: UserId;
  userId: UserId;
  棚ID一覧: 棚ID[];
  _棚の名称での表示_デバッグ用: string[];
  更新日時: Dayjs;

  // ルーム
  constructor(props: 棚の並び順Base) {
    this.id = props.id;
    this.userId = props.userId;
    this.棚ID一覧 = props.棚ID一覧;
    this._棚の名称での表示_デバッグ用 = props._棚の名称での表示_デバッグ用;
    this.更新日時 = props.更新日時;
  }
}
export class 棚の並び順 extends 棚の並び順Base {
  static async 更新(props: { userId: UserId; 棚一覧: 棚[] }) {
    const { userId, 棚一覧 } = props;

    棚の並び順.events.更新.next('開始');
    await FSAppRepository.棚の並び順.更新(
      new 棚の並び順({
        id: userId,
        userId,
        棚ID一覧: 棚一覧.map(i => i.id!),
        _棚の名称での表示_デバッグ用: 棚一覧.map(i => i.name),
        更新日時: dayjs(),
      }),
    );
    棚の並び順.events.更新.next('終了');
  }

  static events = {
    更新: new BehaviorSubject<'init' | '開始' | '終了'>('init'),
  };

  constructor(props: 棚の並び順) {
    super(props);
  }
}
