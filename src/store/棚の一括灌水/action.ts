import { useRecoilState } from 'recoil';
import { 棚の一括灌水State } from '@frontend/store/棚の一括灌水/atom';
import { BehaviorSubject } from 'rxjs';

type Event =
  | {
      type: 'init';
    }
  | {
      type: 'start';
    }
  | {
      type: 'done';
      処理数: number;
    }
  | {
      type: 'error';
    };
const 棚の一括灌水Event = new BehaviorSubject<Event>({ type: 'init' });
export const use棚の一括灌水State = () => {
  const [state, set] = useRecoilState(棚の一括灌水State);

  return {
    is灌水中: state.is灌水中,
    event: 棚の一括灌水Event,
    start: () =>
      set(cur => {
        棚の一括灌水Event.next({ type: 'start' });
        return { ...cur, is灌水中: true };
      }),
    end: (処理数: number) =>
      set(cur => {
        棚の一括灌水Event.next({ type: 'done', 処理数 });
        return { ...cur, is灌水中: false };
      }),
    error: () =>
      set(cur => {
        棚の一括灌水Event.next({ type: 'error' });
        return { ...cur, is灌水中: false };
      }),
  };
};
