import { useRecoilState } from 'recoil';
import { Subject } from 'rxjs';
import { 灌水時の施肥有無設定 } from '@frontend/store/灌水時の施肥有無設定/atom';

export const 灌水時の施肥有無設定イベント = new Subject<boolean>();

export const use灌水時の施肥有無設定 = () => {
  const [state, set] = useRecoilState(灌水時の施肥有無設定);

  return {
    toggle: () => {
      set(pre => {
        灌水時の施肥有無設定イベント.next(!pre.ON);
        return { ...pre, ON: !pre.ON };
      });
    },
    is: state.ON,
  };
};
