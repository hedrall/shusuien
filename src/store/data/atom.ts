import { atom } from 'recoil';
import { 棚, 棚ID } from 'src/domain/entity/棚';
import { 鉢 } from 'src/domain/entity/鉢';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

export type DataState = {
  棚一覧: 棚[];
  鉢一覧: { [Key in 棚ID]: 鉢[] };
  棚の並び順: 棚の並び順 | undefined;
};

export const DATA_STATE_ATOM = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [], 鉢一覧: {}, 棚の並び順: undefined },
});
