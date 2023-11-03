import { RootProperty } from 'src/domain/entity/植物のデフォルト設定/common';
import { FSAppRepository } from 'src/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定/index';
import { 季節 } from '@frontend/domain/const/季節';

export async function _ルートプロパティを更新<Key extends RootProperty>(
  this: 植物ごとのデフォルト設定,
  key: Key,
  value: 植物ごとのデフォルト設定[Key],
) {
  console.log('ルートプロパティ', { key, value });
  await FSAppRepository.植物ごとのデフォルト設定.更新(this.id!, { [key]: value });
}

export async function _日光の強度設定を更新(
  //
  this: 植物ごとのデフォルト設定,
  value: 鉢.日光の強度設定[季節],
  季節: 季節,
) {
  await FSAppRepository.植物ごとのデフォルト設定.更新(this.id!, {
    [`日光の強度設定.${季節}`]: value,
  });
}
