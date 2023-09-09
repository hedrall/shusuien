import { BehaviorSubject } from 'rxjs';
import { useSubscribeState } from 'src/eventBasedStore';

type E1 = { type: 'init' | 'start' | 'error' };
type E2 = { type: 'done'; 処理数: number };
type Event = E1 | E2;

const 棚の一括灌水Event = new BehaviorSubject<Event>({ type: 'init' });

export const use棚の一括灌水State = () => {
  const state = useSubscribeState(棚の一括灌水Event);

  return {
    is灌水中: state?.type === 'start',
    event: 棚の一括灌水Event,
    start: () => 棚の一括灌水Event.next({ type: 'start' }),
    end: (処理数: number) => 棚の一括灌水Event.next({ type: 'done', 処理数 }),
    error: () => 棚の一括灌水Event.next({ type: 'error' }),
  };
};
