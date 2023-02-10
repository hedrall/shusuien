import { atom } from 'recoil';
import { 棚, 棚ID } from '@frontend/domain/model/tana';
import { 鉢 } from '@frontend/domain/model/item';

export type DataState = {
  棚一覧: 棚[];
  鉢一覧: { [Key in 棚ID]: 鉢[] };
};

export const DATA_STATE_ATOM = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [], 鉢一覧: {} },
});
