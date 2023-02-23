import { atom } from 'recoil';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';

export type MasterState = {
  植物のデフォルト設定: 植物ごとのデフォルト設定[];
};

export const MASTER_STATE_ATOM = atom<MasterState>({
  key: 'Master',
  default: { 植物のデフォルト設定: [] },
});
