import { 鉢 } from '@frontend/domain/model/item';
import React from 'react';
import { Descriptions } from 'antd';
import { optionalCall } from '@frontend/supports/functions';
import { 鉢サイズ } from '@frontend/domain/model/history';
import { DATE_READONLY_FORMAT } from '@frontend/supports/date';

const F = DATE_READONLY_FORMAT;

export type MyDescProps = {
  鉢: 鉢;
};

export const 鉢の情報: React.FC<MyDescProps> = props => {
  const { 鉢 } = props;
  const { name, 詳細, snapshot, 作成日時, 補足 } = 鉢;
  const 科_属_種 = [詳細.科, 詳細.属, 詳細.種名].filter(Boolean).join('/');
  const 鉢のサイズ = optionalCall(snapshot.鉢のサイズ, 鉢サイズ.toString);
  const 最後の灌水 = [snapshot.最後の灌水?.日時.format(F), snapshot.最後の灌水?.量].filter(Boolean).join(', ');
  return (
    <Descriptions
      className="鉢の情報"
      title="鉢の情報"
      size={'small'}
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="名前">{name}</Descriptions.Item>
      <Descriptions.Item label="科/属/種">{科_属_種}</Descriptions.Item>
      <Descriptions.Item label="追加">{作成日時.format(F)}</Descriptions.Item>
      <Descriptions.Item label="補足">{補足}</Descriptions.Item>
      <Descriptions.Item label="鉢のサイズ">{鉢のサイズ}</Descriptions.Item>
      <Descriptions.Item label="最後の灌水">{snapshot.最後の植替え?.format(F)}</Descriptions.Item>
      <Descriptions.Item label="最後の植替え">{最後の灌水}</Descriptions.Item>
    </Descriptions>
  );
};
