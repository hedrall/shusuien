import dayjs from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { 履歴 } from '@frontend/domain/model/history';
import { 鉢, 鉢のBase } from '@frontend/domain/model/item';

export namespace _成長を記録する {
  export type Props = {
    imageDataUrl: string;
    memo: string;
    props: Omit<鉢のBase, 'id' | 'snapshot' | '作成日時'>;
  };
}
export const _成長を記録する = async (params: _成長を記録する.Props) => {
  const { imageDataUrl, memo, props } = params;
  const { userId } = props;

  const now = dayjs();
  console.log('1. 画像をUpload');
  const 鉢ID = await FSAppRepository.鉢.getId();
  console.log('鉢ID', 鉢ID);
  const { 画像のPATH } = await StorageRepository.uploadImageByBase64String({
    dataUrl: imageDataUrl,
    path: StorageRepository.storagePath({
      type: '鉢',
      userId,
      datetime: now,
      itemId: 鉢ID,
    }),
  });

  console.log('2. 鉢を作成する');
  const 新規鉢 = new 鉢({
    ...props,
    id: undefined,
    snapshot: {
      更新日時: now,
      画像のPATH,
    },
    作成日時: now,
  });
  await FSAppRepository.鉢.作成(新規鉢, 鉢ID);

  console.log('3. 画像更新履歴を作成');
  await 履歴.新規作成.画像の更新歴({
    props: {
      作成日時: now,
      userId,
      対象の鉢のID: 鉢ID,
      対象の棚のID: undefined,
    },
    内容: {
      memo,
      画像のPATH,
    },
  });
};
