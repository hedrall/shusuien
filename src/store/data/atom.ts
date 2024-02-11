import { atom } from 'recoil';
import { 棚 } from 'src/domain/entity/棚';
import { 鉢 } from 'src/domain/entity/鉢';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

/**
 * Globalで保持するデータ一覧
 * 棚一覧: 棚の一覧
 * 鉢一覧: 棚ごとの鉢一覧。鉢全体を格納するために `#@$$@#all` もキーとして利用している
 */
// TODO: GlobalStateに変更したい
export type DataState = {
  棚一覧: 棚[];
  鉢一覧: { [Key in 棚.Id]: 鉢[] };
  棚の並び順: 棚の並び順 | undefined;
};

export const DATA_STATE_ATOM = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [], 鉢一覧: {}, 棚の並び順: undefined },
});
