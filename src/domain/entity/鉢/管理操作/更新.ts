import { FSAppRepository } from 'src/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';

export async function _詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(
  this: 鉢,
  key: Key,
  value: V,
  suppressEmit = false,
) {
  const updates = {
    [`詳細.${key}`]: value,
  };
  console.log('_詳細を更新', { updates });
  await FSAppRepository.鉢.更新(this.id!, updates);
  if (!suppressEmit) 鉢.events.詳細を更新.next({ プロパティ名: key, 更新後のValue: value });
}

export async function _日光の強度を更新<Key extends keyof 鉢.日光の強度設定, V = 鉢.日光の強度設定[Key]>(
  this: 鉢,
  key: Key,
  value: V,
) {
  const updated = {
    ...this.詳細.日光の強度設定,
    [key]: value,
  };
  if (!value) {
    delete updated[key];
  }
  await FSAppRepository.鉢.更新(this.id!, {
    [`詳細.日光の強度設定`]: updated,
  });
  鉢.events.詳細を更新.next({ プロパティ名: key, 更新後のValue: value });
}

export async function _フィールドを更新<Key extends 鉢.更新可能なフィールドのKey, V = 鉢[Key]>(
  this: 鉢,
  key: Key,
  value: V,
) {
  await FSAppRepository.鉢.更新(this.id!, {
    [key]: value,
  });
  鉢.events.フィールドを更新.next({ フィールド名: key, 更新後のValue: value });
}
