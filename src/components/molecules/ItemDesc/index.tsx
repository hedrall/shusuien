import { 鉢 } from '@frontend/domain/model/item';
import React from 'react';
import { Descriptions } from 'antd';
import { optionalCall } from '@frontend/supports/functions';
import { 鉢サイズ } from '@frontend/domain/model/history';
import { DATE_READONLY_FORMAT } from '@frontend/supports/date';
import { Editable } from '@frontend/components/atoms/Editable';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

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
  const 最後の植替え = [snapshot.最後の植替え?.format(F)].filter(Boolean).join(', ');
  function 詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.詳細を更新(key, value);
    };
  }
  function フィールドを更新<Key extends 'name' | '補足', V = 鉢[Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.フィールドを更新(key, value);
    };
  }
  return (
    <Descriptions
      className="鉢の情報"
      title="鉢の情報"
      size={'small'}
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="名前">
        <Editable value={name || ''} name="name" onSubmit={フィールドを更新('name')} />
      </Descriptions.Item>
      <Descriptions.Item label="科/属/種" className="科属種">
        <div className="項目">
          科: <Editable value={詳細.科 || ''} name="name" onSubmit={詳細を更新('科')} />
        </div>
        <div className="項目">
          属: <Editable value={詳細.属 || ''} name="name" onSubmit={詳細を更新('属')} />
        </div>
        <div className="項目">
          種名: <Editable value={詳細.種名 || ''} name="name" onSubmit={詳細を更新('種名')} />
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="追加日時">{作成日時.format(F)}</Descriptions.Item>
      <Descriptions.Item label="入手元">
        <Editable value={詳細.入手元 || ''} name="name" onSubmit={詳細を更新('入手元')} />
      </Descriptions.Item>
      <Descriptions.Item label="金額">
        <Editable value={詳細.金額 || 0} name="name" onSubmit={詳細を更新('金額')} />
      </Descriptions.Item>
      <Descriptions.Item label="補足">
        <Editable value={補足 || ''} name="補足" onSubmit={フィールドを更新('補足')} />
      </Descriptions.Item>
      <Descriptions.Item label="鉢のサイズ">{鉢のサイズ}</Descriptions.Item>
      <Descriptions.Item label="最後の灌水">{最後の灌水}</Descriptions.Item>
      <Descriptions.Item label="最後の植替え">{最後の植替え}</Descriptions.Item>
    </Descriptions>
  );
};
