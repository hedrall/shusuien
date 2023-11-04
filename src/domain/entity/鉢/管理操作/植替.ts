import { User } from 'src/domain/entity/user';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { Dayjs } from 'dayjs';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { 小画像の生成 } from 'src/domain/entity/鉢/管理操作/新規作成';
import { _履歴を適用 } from 'src/domain/entity/鉢/管理操作/common';

export type _植替えする = (this: 鉢, params: _植替えするParams) => Promise<void>;
export type _植替えするParams = {
  imageDataUrl: string;
  userId: User.Id;
  鉢のサイズ: 履歴.植替え.鉢サイズ;
  memo: string | undefined;
  date: Dayjs;
};
export async function _植替えする(this: 鉢.Resource, params: _植替えするParams) {
  const { imageDataUrl, userId, 鉢のサイズ, date, memo } = params;

  console.log('1. 画像をuploadする');
  const 鉢Id = this.id!;
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
  const 画像のURL = await StorageRepository.getDownloadUrls(画像のPATH);
  const { small画像のURL } = await 小画像の生成(imageDataUrl, pathBaseParams);

  console.log('2. 植替えの履歴を作成');
  const 植替え履歴 = await 履歴.植替え.create({
    props: {
      userId,
      作成日時: date,
      対象の棚のID: undefined,
      対象の鉢のID: 鉢Id,
    },
    内容: {
      植替え後の画像のURL: 画像のURL,
      植替え日時: date,
      鉢のサイズ,
      memo,
    },
  });

  console.log('3. 鉢の情報を更新する');
  const 更新後の鉢 = _履歴を適用(this, 植替え履歴, small画像のURL);
  await FSAppRepository.鉢.snapshotを更新(鉢Id, 更新後の鉢.snapshot, date);
  鉢.events.管理.next({ type: '植替え' });
}
