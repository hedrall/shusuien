import { UserId } from 'src/domain/entity/user';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import dayjs from 'dayjs';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { 小画像の生成 } from 'src/domain/entity/鉢/管理操作/新規作成';
import { _履歴を適用 } from 'src/domain/entity/鉢/管理操作/common';

export namespace _成長を記録する {
  export type Params = {
    item: 鉢;
    userId: UserId;
    imageDataUrl: string | undefined;
    memo: string | undefined;
    画像を更新する: boolean;
  };
}
export const _成長を記録する = async (params: _成長を記録する.Params) => {
  const { item, userId, imageDataUrl, memo, 画像を更新する } = params;
  const 鉢Id = item.id!;
  const date = dayjs();
  let 画像のURL: string | undefined = undefined;
  let small画像のURL: string | undefined = undefined;

  console.log('1. あれば画像をuploadする');
  if (imageDataUrl) {
    const pathBaseParams = {
      userId,
      datetime: date,
      itemId: 鉢Id,
    };
    const { 画像のPATH } = await StorageRepository.uploadImageByBase64String({
      dataUrl: imageDataUrl,
      path: StorageRepository.storagePath({
        type: '鉢',
        ...pathBaseParams,
      }),
    });
    画像のURL = await StorageRepository.getDownloadUrls(画像のPATH);
    small画像のURL = (await 小画像の生成(imageDataUrl, pathBaseParams)).small画像のURL;
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
      画像のURL: 画像のURL,
      memo,
    },
  });

  console.log('3. 鉢の情報を更新する');
  const 更新後の鉢 = _履歴を適用(item, 植替え履歴, small画像のURL, 画像を更新する);
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
  鉢.events.管理.next({ type: '成長の記録' });
};
