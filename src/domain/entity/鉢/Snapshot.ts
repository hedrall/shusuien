import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { Dayjs } from 'dayjs';

// 鉢の現在の状態を記録する部分
export type _Snapshot = {
  鉢のサイズ?: 履歴.植替え.鉢サイズ;
  最後の植替え?: Dayjs;
  最後の灌水?: {
    日時: Dayjs;
    量: 履歴.灌水.灌水量;
  };
  最後の液肥: { 日時?: Dayjs };
  画像のURL?: string;
  small画像のURL?: string;
  更新日時: Dayjs;
};
