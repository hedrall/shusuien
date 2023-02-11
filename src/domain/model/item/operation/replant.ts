import { UserId } from '@frontend/domain/model/user';
import { 履歴, 鉢サイズ } from '@frontend/domain/model/history';
import { Dayjs } from 'dayjs';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from '@frontend/domain/model/item';

export type _植替えするParams = {
  item: 鉢;
  imageDataUrl: string;
  userId: UserId;
  鉢のサイズ: 鉢サイズ;
  memo: string | undefined;
  date: Dayjs;
};
export const _植替えする = async (params: _植替えするParams) => {
  const { item, imageDataUrl, userId, 鉢のサイズ, date, memo } = params;
  console.log('1. 画像をuploadする');
  const 鉢Id = item.id!;
  const { 画像のPATH } = await StorageRepository.uploadImageByBase64String({
    dataUrl: imageDataUrl,
    path: StorageRepository.storagePath({
      type: '鉢',
      userId,
      datetime: date,
      itemId: 鉢Id,
    }),
  });
  console.log('2. 植替えの履歴を作成');
  const 植替え履歴 = await 履歴.新規作成.植替え({
    props: {
      userId,
      作成日時: date,
      対象の棚のID: undefined,
      対象の鉢のID: 鉢Id,
    },
    内容: {
      植替え後の画像のPATH: 画像のPATH,
      植替え日時: date,
      鉢のサイズ,
      memo,
    },
  });
  console.log('3. 鉢の情報を更新する');
  const 更新後の鉢 = item.履歴を適用(植替え履歴);
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
};
