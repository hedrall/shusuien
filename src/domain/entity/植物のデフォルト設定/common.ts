import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定/index';

export type RootProperty = Extract<keyof 植物ごとのデフォルト設定, '育成タイプ' | '耐寒温度' | '水切れ日数'>;
