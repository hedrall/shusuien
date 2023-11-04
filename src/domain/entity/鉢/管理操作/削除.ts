import { FSAppRepository } from 'src/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';

export async function _削除(this: 鉢) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, { 削除済み: true });
  鉢.events.削除.next({ item: this });
}
