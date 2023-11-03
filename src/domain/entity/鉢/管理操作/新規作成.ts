import { 鉢 } from 'src/domain/entity/鉢';
import dayjs, { Dayjs } from 'dayjs';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { BrowserRepository } from '@frontend/domain/repository/browser';
import { User } from 'src/domain/entity/user';

export const 小画像の生成 = async (
  dataUrl: string,
  PathParamBase: {
    userId: User.Id;
    datetime: Dayjs;
    itemId: 鉢.Id;
  },
) => {
  // 小さい画像も生成する
  const small画像DataUrl = await BrowserRepository.Image.canvasImageCompressor(dataUrl);
  console.log({ small画像DataUrl: small画像DataUrl.length });
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
  props: Omit<鉢.Props, 'id' | 'snapshot' | '作成日時' | '削除済み'>;
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
  const 新規鉢 = 鉢.construct({
    ...props,
    id: undefined,
    削除済み: false,
    snapshot: {
      更新日時: now,
      画像のURL,
      small画像のURL,
      最後の液肥: { 日時: undefined },
    },
    作成日時: now,
  });
  await FSAppRepository.鉢.作成(新規鉢, 鉢ID);

  console.log('3. 成長記録履歴を作成');
  await 履歴.成長の記録.create({
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
  鉢.events.管理.next({ type: '新規作成' });
};
