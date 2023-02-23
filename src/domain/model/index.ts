import { 鉢 } from '@frontend/domain/model/item';
import { 棚 } from '@frontend/domain/model/tana';
import { 履歴 } from '@frontend/domain/model/history';
import { User } from '@frontend/domain/model/user';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';

export type Entity = 鉢 | 棚 | 履歴 | User | 植物ごとのデフォルト設定;
