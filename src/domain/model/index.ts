import { 鉢 } from '@frontend/domain/model/鉢';
import { 棚 } from '@frontend/domain/model/棚';
import { 履歴 } from '@frontend/domain/model/履歴';
import { User } from '@frontend/domain/model/user';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/植物のデフォルト設定';
import { 棚の並び順 } from '@frontend/domain/model/棚の並び順';

export type Entity = 鉢 | 棚 | 履歴 | User | 植物ごとのデフォルト設定 | 棚の並び順;
