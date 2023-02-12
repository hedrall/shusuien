import { 鉢のBase } from '@frontend/domain/model/item';
import { _成長を記録する } from '@frontend/domain/model/item/operation/docGrowth';

export type 新規作成のParams = {
  imageDataUrl: string;
  props: Omit<鉢のBase, 'id' | 'snapshot' | '作成日時'>;
};
export const _新規作成する = async (params: 新規作成のParams) => {
  const { imageDataUrl, props } = params;
  return await _成長を記録する({
    imageDataUrl,
    memo: '[自動記録]: 鉢を新規についかしました。',
    props,
  });
};
