import { UserId } from 'src/domain/entity/user';
import { 履歴, 履歴の内容 } from 'src/domain/entity/履歴';
import dayjs from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { _履歴を適用 } from 'src/domain/entity/鉢/管理操作/common';

export type _灌水操作Params = {
  item: 鉢;
  userId: UserId;
  灌水量: 履歴の内容.灌水.量のKey型;
  液肥入り: boolean;
};

export const _灌水する = async (params: _灌水操作Params) => {
  const { item, userId, 灌水量, 液肥入り } = params;

  const 鉢Id = item.id!;
  const date = dayjs();

  // console.log('1. 灌水の履歴を作成');
  const 灌水履歴 = await 履歴.新規作成.灌水({
    props: {
      userId,
      作成日時: date,
      対象の棚のID: undefined,
      対象の鉢のID: 鉢Id,
    },
    内容: { 灌水量, 液肥入り },
  });

  // console.log('2. 鉢の情報を更新する');
  const 更新後の鉢 = _履歴を適用(item, 灌水履歴, undefined);
  console.log({ 更新後の鉢 });
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
  鉢.events.管理.next({ type: '灌水' });
};
