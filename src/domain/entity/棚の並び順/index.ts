import { User } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { 棚 } from 'src/domain/entity/棚';
import { BehaviorSubject } from 'rxjs';

const _更新 = async function 更新(props: { userId: User.Id; 棚一覧: 棚[] }) {
  const { userId, 棚一覧 } = props;

  棚の並び順.events.更新.next('開始');
  await FSAppRepository.棚の並び順.更新(
    棚の並び順.construct({
      id: userId,
      userId,
      棚ID一覧: 棚一覧.map(i => i.id!),
      更新日時: dayjs(),
      _棚の名称での表示_デバッグ用: 棚一覧.map(i => i.name),
    }),
  );
  棚の並び順.events.更新.next('終了');
};

export namespace 棚の並び順 {
  export type Props = {
    id: User.Id;
    userId: User.Id;
    棚ID一覧: 棚.Id[];
    更新日時: Dayjs;
    _棚の名称での表示_デバッグ用: string[];
  };

  export const construct = (props: 棚の並び順.Props) => {
    return {
      id: props.id,
      userId: props.userId,
      棚ID一覧: props.棚ID一覧,
      更新日時: props.更新日時,
      _棚の名称での表示_デバッグ用: props._棚の名称での表示_デバッグ用,
    };
  };

  export const events = {
    更新: new BehaviorSubject<'init' | '開始' | '終了'>('init'),
  };

  export const 更新 = _更新;
}
export type 棚の並び順 = ReturnType<typeof 棚の並び順.construct>;
