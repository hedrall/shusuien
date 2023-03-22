import React, { useRef } from 'react';
import { 棚, 棚ID } from '@frontend/domain/model/tana';
import { Button, Image, ImageProps, Select, SelectProps, Table, TableColumnsType } from 'antd';
import { use鉢一覧, 棚Selector } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢 } from '@frontend/domain/model/item';
import { User } from '@frontend/domain/model/user';
import { Editable } from '@frontend/components/atoms/Editable';
import { NO_IMAGE } from '@frontend/supports/image';
import { デフォルト設定から選択するモーダル } from '@frontend/components/organisms/SelectFromDefaultSettingModal';
import { useRecoilState, useRecoilValue } from 'recoil';

export type TableViewProps = {
  棚一覧: 棚[];
};

interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

const Row: React.FC<{ 棚: 棚; user: User | undefined }> = props => {
  function 詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(鉢: 鉢, key: Key) {
    return async (value: V) => {
      await 鉢.詳細を更新(key, value);
    };
  }

  const { 棚, user } = props;
  const { 鉢一覧 } = use鉢一覧(棚.id!, user);
  const 棚一覧 = useRecoilValue(棚Selector);
  const ref = useRef<デフォルト設定から選択するモーダル.Ref | null>(null);

  const getRender = (key: keyof 鉢['詳細']) => (_: unknown, 鉢: 鉢) => {
    const value = 鉢.詳細[key] || '';
    return <Editable value={value} name={key} onSubmit={詳細を更新(鉢, key)} />;
  };

  const columns: TableColumnsType<鉢> = [
    {
      title: '画像',
      dataIndex: 'image',
      key: 'image',
      className: 'テーブル表示の鉢の画像Cell',
      render: (_, 鉢) => {
        const imageProps: ImageProps = {
          className: 'テーブル表示の鉢の画像',
          preview: true,
          src: 鉢.snapshot.small画像のURL || 鉢.snapshot.画像のURL || NO_IMAGE,
          style: { borderRadius: 7, aspectRatio: '1', objectFit: 'cover' },
          role: 'button',
        };
        return <Image {...imageProps} />;
      },
    },
    {
      title: 'デフォルト設定から選ぶ',
      dataIndex: 'd',
      key: 'd',
      render: (_, 鉢) => {
        const onClick = () => ref.current?.open?.(鉢);
        return (
          <Button
            tabIndex={0}
            onClick={onClick}
            onKeyDown={e => {
              if (e.key === 'Enter') onClick();
            }}
            role="button"
          >
            選択する
          </Button>
        );
      },
    },
    {
      title: '名前',
      dataIndex: 'name',
      key: 'name',
      render: (_, 鉢) => {
        return <Editable value={鉢.name} name="name" onSubmit={e => 鉢.フィールドを更新('name', e)} />;
      },
    },
    {
      title: '科',
      dataIndex: '科',
      key: '科',
      render: getRender('科'),
    },
    { title: '属', dataIndex: '属', key: '属', render: getRender('属') },
    { title: '種', dataIndex: '種', key: '種', render: getRender('種名') },
    {
      title: '棚',
      dataIndex: '棚',
      key: '棚',
      render: (_: unknown, 鉢: 鉢) => {
        const 棚を変更 = async (id: 棚ID) => {
          await 鉢.フィールドを更新('棚Id', id);
        };
        const 棚SelectProps: SelectProps = {
          options: 棚一覧.map(i => ({ value: i.id, label: i.name })),
          onChange: e => 棚を変更(e as 棚ID),
          value: 鉢.棚Id,
          style: { width: '100%' },
          listHeight: 300,
        };
        return <Select {...棚SelectProps} />;
      },
      width: 300,
    },
  ];
  console.log({ 鉢一覧 });
  return (
    <>
      <Table key={棚.id} columns={columns} dataSource={鉢一覧.map(i => ({ ...i, key: i.id }))} pagination={false} />
      <デフォルト設定から選択するモーダル ref={ref} />
    </>
  );
};

const expandedRowRender = (user?: User) => (棚: 棚, index: number) => {
  return <Row key={index} 棚={棚} user={user} />;
};

export const テーブル表示: React.FC<TableViewProps> = props => {
  const { 棚一覧 } = props;
  const { user } = useAuthState();

  const columns: TableColumnsType<棚> = [
    {
      title: '棚名',
      dataIndex: 'name',
      key: 'name',
    },
    { title: '作成日時', dataIndex: '作成日時', key: '作成日時' },
  ];

  return (
    <div className="テーブル表示">
      <Table
        columns={columns}
        expandable={{ expandedRowRender: expandedRowRender(user) }}
        pagination={undefined}
        dataSource={棚一覧.map(i => ({
          ...i,
          key: i.id,
        }))}
      />
    </div>
  );
};
