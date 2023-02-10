import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴 } from '@frontend/domain/model/history';
import { 棚ID } from '@frontend/domain/model/tana';

export type 鉢Id = Opaque<string, '鉢ID'>;
export class 鉢のBase {
  id: 鉢Id | undefined;
  userId: UserId;
  name: string | undefined;
  棚Id: 棚ID;
  詳細: {
    科?: string;
    属?: string;
    種名?: string;
  };
  補足?: string;
  // 履歴を畳み込んで得られるもの
  snapshot: {
    画像のPATH?: string;
  };
  作成日時: Dayjs;

  constructor(props: 鉢のBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.棚Id = props.棚Id;
    this.snapshot = {
      画像のPATH: props.snapshot.画像のPATH,
    };
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      種名: props.詳細.種名,
    };
    this.補足 = props.補足;
    this.作成日時 = dayjs(props.作成日時);
  }
}

export type 新規作成のParams = {
  imageDataUrl: string;
  props: Omit<鉢のBase, 'id' | 'snapshot' | '作成日時'>;
};

const _新規作成 = async (params: 新規作成のParams) => {
  const { imageDataUrl, props } = params;
  const { userId } = props;

  console.log('1. 鉢を作成する');
  const 新規鉢 = new 鉢({
    ...props,
    id: undefined,
    snapshot: {},
    作成日時: dayjs(),
  });
  const { 鉢ID } = await FSAppRepository.鉢.作成(新規鉢);

  console.log('2. 画像をUpload');
  const { 画像のPATH } = await StorageRepository.uploadImageByBase64String({
    dataUrl: imageDataUrl,
    path: StorageRepository.storagePath({
      type: '鉢',
      userId,
      itemId: 鉢ID,
    }),
  });

  console.log('3. 画像の変更履歴を作成する');
  await 履歴.新規作成.画像の更新歴({
    props: {
      userId,
      対象の鉢のID: 鉢ID,
      対象の棚のID: undefined,
    },
    内容: {
      画像のPATH,
    },
  });

  console.log('4. 鉢を更新する');
  await FSAppRepository.鉢.画像を更新(鉢ID, 画像のPATH);
};

export class 鉢 extends 鉢のBase {
  static 新規作成 = _新規作成;

  constructor(props: 鉢のBase) {
    super(props);
  }

  static create = () => {
    /**
     * 1. 鉢を生成するf
     * 2. 画像の更新歴を作成する
     * 3. 鉢の画像を更新する
     */
    // const 鉢 = new 鉢()
    // 画像の更新歴を作成する
  };
}
