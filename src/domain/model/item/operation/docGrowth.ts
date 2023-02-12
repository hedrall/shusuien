import { UserId } from '@frontend/domain/model/user';
import { 履歴, 鉢サイズ } from '@frontend/domain/model/history';
import dayjs, { Dayjs } from 'dayjs';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from '@frontend/domain/model/item';

export namespace _成長を記録する {
  export type Params = {
    item: 鉢;
    userId: UserId;
    imageDataUrl: string | undefined;
    memo: string | undefined;
  };
}
export const _成長を記録する = async (params: _成長を記録する.Params) => {
  const { item, userId, imageDataUrl, memo } = params;
  const 鉢Id = item.id!;
  const date = dayjs();
  let 画像のPATH: string | undefined = undefined;

  console.log('1. あれば画像をuploadする');
  if (imageDataUrl) {
    const { 画像のPATH: path } = await StorageRepository.uploadImageByBase64String({
      dataUrl: imageDataUrl,
      path: StorageRepository.storagePath({
        type: '鉢',
        userId,
        datetime: date,
        itemId: 鉢Id,
      }),
    });
    画像のPATH = path;
  }

  console.log('2. 成長記録履歴を作成');
  const 植替え履歴 = await 履歴.新規作成.成長記録({
    props: {
      userId,
      作成日時: date,
      対象の棚のID: undefined,
      対象の鉢のID: 鉢Id,
    },
    内容: {
      画像のPATH,
      memo,
    },
  });

  console.log('3. 鉢の情報を更新する');
  const 更新後の鉢 = item.履歴を適用(植替え履歴);
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
};
