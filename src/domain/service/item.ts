import { 鉢 } from '@frontend/domain/model/item';

export namespace 鉢Service {
  export const 並び替える = (鉢一覧: 鉢[]) => {
    return 鉢一覧.slice().sort((cur, pre) => {
      const c = (['科', '属', '種名'] as const).map(key => cur.詳細[key] || '').join();
      const p = (['科', '属', '種名'] as const).map(key => pre.詳細[key] || '').join();
      return c > p ? 1 : -1;
    });
  };
}
