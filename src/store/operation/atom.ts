import { atom } from 'recoil';
import { 履歴の内容 } from '@frontend/domain/model/history';

export type OperationState = {
  一括灌水モード設定: {
    ON: boolean;
    灌水量: 履歴の内容.灌水.量のKey型;
  };
};

export const OPERATION_STATE_ATOM = atom<OperationState>({
  key: 'Operation',
  default: {
    一括灌水モード設定: {
      ON: false,
      灌水量: 履歴の内容.灌水.量の定義['鉢いっぱい'].key,
    },
  },
});
