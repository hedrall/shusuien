import { Opaque } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴 } from '@frontend/domain/model/history';

export type 新規作成のProps = {
  file: File;
  userId: UserId;
  詳細: 鉢['詳細'];
};
export type 鉢Id = Opaque<string, '鉢ID'>;
export class 鉢 {
  id: 鉢Id | undefined;
  userId: UserId;
  詳細: {
    科?: string;
    属?: string;
    種名?: string;
    補足名?: string;
  };
  // 履歴を畳み込んで得られるもの
  snapshot: {
    画像のPATH?: string;
  };
  作成日時: Dayjs;

  static async 新規作成(props: 新規作成のProps) {
    const { file, userId, 詳細 } = props;

    // 1. 画像をUpload
    const { 画像のPATH } = await StorageRepository.uploadImage({
      file,
      filePath: StorageRepository.画像のPATH.鉢,
    });

    // 2. 鉢を作成する
    const 新規鉢 = new 鉢({
      id: undefined,
      userId,
      /* 初回作成なので、snapshot情報もここで入れてしまう */
      snapshot: { 画像のPATH },
      詳細: {
        科: 詳細.科,
        属: 詳細.属,
        種名: 詳細.種名,
        補足名: 詳細.補足名,
      },
      作成日時: dayjs(),
    });
    const { 鉢ID } = await FSAppRepository.鉢.作成(新規鉢);

    // 3. 画像の変更履歴を作成する
    await 履歴.新規作成.画像の更新歴({
      userId,
      鉢ID,
      画像のPATH,
    });
  }

  constructor(props: 鉢) {
    this.id = props.id;
    this.userId = props.userId;
    this.snapshot = {
      画像のPATH: props.snapshot.画像のPATH,
    };
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      補足名: props.詳細.補足名,
    };
    this.作成日時 = dayjs(props.作成日時);
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
