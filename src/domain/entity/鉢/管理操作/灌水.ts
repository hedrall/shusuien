import { User } from 'src/domain/entity/user';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import dayjs from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { _履歴を適用 } from 'src/domain/entity/鉢/管理操作/common';

export type _灌水操作Params = {
  userId: User.Id;
  灌水量: 履歴.灌水.灌水量;
  液肥入り: boolean;
};

export async function _灌水する(this: 鉢, params: _灌水操作Params) {
  const { userId, 灌水量, 液肥入り } = params;

  const 鉢Id = this.id!;
  const date = dayjs();

  // console.log('1. 灌水の履歴を作成');
  const 灌水履歴 = await 履歴.灌水.create({
    props: {
      userId,
      作成日時: date,
      対象の棚のID: undefined,
      対象の鉢のID: 鉢Id,
    },
    内容: { 灌水量, 液肥入り },
  });

  // console.log('2. 鉢の情報を更新する');
  const 更新後の鉢 = _履歴を適用(this, 灌水履歴, undefined);
  console.log({ 更新後の鉢 });
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
  鉢.events.管理.next({ type: '灌水' });
}
