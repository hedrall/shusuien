import { selector, useRecoilState } from 'recoil';
import { OPERATION_STATE_ATOM, OperationState } from '@frontend/store/operation/atom';
import { 履歴の内容 } from '@frontend/domain/model/history';
import { Subject } from 'rxjs';

export const 一括灌水モードイベント = new Subject<boolean>();

export const 一括灌水モード設定Selector = selector<OperationState['一括灌水モード設定']>({
  key: '一括灌水モードSelector',
  get: ({ get }) => {
    return get(OPERATION_STATE_ATOM).一括灌水モード設定;
  },
  set: ({ set }, item) => {
    set(OPERATION_STATE_ATOM, pre => {
      return { ...pre, 一括灌水モード設定: item };
    });
    if ('ON' in item) 一括灌水モードイベント.next(item.ON);
  },
});

export const use一括灌水モード設定 = () => {
  const [state, set] = useRecoilState(一括灌水モード設定Selector);

  return {
    isをトグル: () => {
      console.log('ON', state);
      set(pre => ({ ...pre, ON: !pre.ON }));
    },
    灌水量をセット: (灌水量: 履歴の内容.灌水.量のKey型) => set({ ...state, 灌水量 }),
    state,
  };
};
