import { 鉢 } from 'src/domain/entity/鉢';
import { 棚 } from 'src/domain/entity/棚';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { User } from 'src/domain/entity/user';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

export type Entity = 鉢 | 棚 | 履歴 | User | 植物ごとのデフォルト設定 | 棚の並び順;
export type ClassEntity = never;
export type MixinEntity = Exclude<Entity, ClassEntity>;
export type EntityHasId = User | 植物ごとのデフォルト設定 | 棚の並び順 | 棚;
export type EntityId<T extends Entity> = T extends EntityHasId
  ? NonNullable<T['id']>
  : T extends 鉢
    ? 鉢.Id
    : T extends 履歴
      ? 履歴.Id
      : never;
