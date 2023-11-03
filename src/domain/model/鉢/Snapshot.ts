import { 履歴の内容, 鉢サイズ } from 'src/domain/model/履歴';
import { Dayjs } from 'dayjs';

// 鉢の現在の状態を記録する部分
export type _Snapshot = {
  鉢のサイズ?: 鉢サイズ;
  最後の植替え?: Dayjs;
  最後の灌水?: {
    日時: Dayjs;
    量: 履歴の内容.灌水.量のKey型;
  };
  最後の液肥: { 日時?: Dayjs };
  画像のURL?: string;
  small画像のURL?: string;
  更新日時: Dayjs;
};
