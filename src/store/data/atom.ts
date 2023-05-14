import { atom } from 'recoil';
import { 棚, 棚ID } from '@frontend/domain/model/棚';
import { 鉢 } from 'src/domain/model/鉢';

export type DataState = {
  棚一覧: 棚[];
  鉢一覧: { [Key in 棚ID]: 鉢[] };
};

export const DATA_STATE_ATOM = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [], 鉢一覧: {} },
});
