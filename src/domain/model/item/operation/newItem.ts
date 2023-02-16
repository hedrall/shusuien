import { 鉢, 鉢Id, 鉢のBase } from '@frontend/domain/model/item';
import { _成長を記録する } from '@frontend/domain/model/item/operation/docGrowth';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { 履歴 } from '@frontend/domain/model/history';
import { BrowserRepository } from '@frontend/domain/repository/browser';
import { UserId } from '@frontend/domain/model/user';

export const 小画像の生成 = async (
  dataUrl: string,
  PathParamBase: {
    userId: UserId;
    datetime: Dayjs;
    itemId: 鉢Id;
  },
) => {
  // 小さい画像も生成する
  const { dataUrl: small画像DataUrl } = await BrowserRepository.Image.compressBase64Image(dataUrl, 5 /* 5kb */);
  const { 画像のPATH: small画像のPATH } = await StorageRepository.uploadImageByBase64String({
    dataUrl: small画像DataUrl,
    path: StorageRepository.storagePath({
      ...PathParamBase,
      type: '鉢',
      index: 'sm',
    }),
  });
  const small画像のURL = await StorageRepository.getDownloadUrls(small画像のPATH);
  return { small画像のURL };
};
export type 新規作成のParams = {
  imageDataUrl: string;
  props: Omit<鉢のBase, 'id' | 'snapshot' | '作成日時' | '削除済み'>;
};
export const _新規作成する = async (params: 新規作成のParams) => {
  const { imageDataUrl, props } = params;
  const { userId } = props;

  const now = dayjs();
  console.log('1. 画像をUpload');
  const 鉢ID = await FSAppRepository.鉢.getId();
  console.log('鉢ID', 鉢ID);
  const PathParamBase = {
    type: '鉢',
    userId,
    datetime: now,
    itemId: 鉢ID,
  } as const;
  const { 画像のPATH } = await StorageRepository.uploadImageByBase64String({
    dataUrl: imageDataUrl,
    path: StorageRepository.storagePath({
      ...PathParamBase,
    }),
  });
  const 画像のURL = await StorageRepository.getDownloadUrls(画像のPATH);
  // 小さい画像も生成する
  const { small画像のURL } = await 小画像の生成(imageDataUrl, PathParamBase);

  console.log({ 画像のPATH, 画像のURL, small画像のURL });

  console.log('2. 鉢を作成する');
  const 新規鉢 = new 鉢({
    ...props,
    id: undefined,
    削除済み: false,
    snapshot: {
      更新日時: now,
      画像のURL,
      small画像のURL,
    },
    作成日時: now,
  });
  await FSAppRepository.鉢.作成(新規鉢, 鉢ID);

  console.log('3. 成長記録履歴を作成');
  await 履歴.新規作成.成長記録({
    props: {
      作成日時: now,
      userId,
      対象の鉢のID: 鉢ID,
      対象の棚のID: undefined,
    },
    内容: {
      memo: '[自動記載]: 新規に鉢を追加しました。',
      画像のURL: 画像のURL,
    },
  });
};
