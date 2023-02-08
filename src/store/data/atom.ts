import { atom } from 'recoil';
import { 棚 } from '@frontend/domain/model/tana';

export type DataState = {
  棚一覧: 棚[];
};

export const DATA_STATE = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [] },
});
