import { _Common as __C, _ICommon } from 'src/service/common';
import { useAuthState } from 'src/store/auth/action';
import { use植物ごとのデフォルト設定 } from 'src/store/master/action';
import { 植物ごとのデフォルト設定サービス } from 'src/domain/service/plantDefaultSetting';

const Service: _ICommon = __C;

export const _useお手入れページの鉢一覧 = () => {
  const { user } = useAuthState();
  const { フィルタを鉢に適用, isデフォルト状態 } = Service.Filter.Use();
  const 鉢一覧 = Service.鉢.useAll(user, 'お手入れ');
  const { 植物ごとのデフォルト設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();

  // フィルタが設定されていなければ、何も返さない
  if (isデフォルト状態()) return [];

  return 鉢一覧.filter(フィルタを鉢に適用).map(i => {
    return 植物ごとのデフォルト設定サービス.デフォルト直を適用(i, 植物ごとのデフォルト設定一覧);
  });
};
