import { atom } from 'recoil';
import { 棚 } from '@frontend/domain/model/tana';
import { RefValue } from '@frontend/domain/repository/firestore/type';

type DataState = {
  棚一覧: RefValue<棚>[];
};

export const DATA_STATE = atom<DataState>({
  key: 'Data',
  default: { 棚一覧: [] },
});
