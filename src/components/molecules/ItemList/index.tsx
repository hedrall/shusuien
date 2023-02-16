import React, { useEffect, useRef } from 'react';
import { Col, Collapse, Row } from 'antd';
import { 棚 } from '@frontend/domain/model/tana';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 鉢作成モーダル } from '@frontend/components/organisms/CreateItemModal';
import { use鉢一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { 鉢一覧の要素 } from '@frontend/components/atoms/ItemListCell';
import { 鉢管理モーダル } from '@frontend/components/organisms/OperateItemModal';

const { Panel } = Collapse;

export type ItemListProps = {
  棚: 棚;
};

export const 鉢一覧: React.FC<ItemListProps> = props => {
  const { 棚 } = props;
  const 鉢操作モーダルRef = useRef<鉢作成モーダル.Ref | null>(null);
  const 鉢管理モーダルRef = useRef<鉢管理モーダル.Ref | null>(null);
  const { user } = useAuthState();

  const 棚Id = 棚.id!;
  const { 鉢一覧 } = use鉢一覧(棚Id, user);

  const 鉢作成モーダルを開く = () => 鉢操作モーダルRef.current?.open();

  const 鉢を選択 = (鉢: 鉢) => {
    鉢管理モーダルRef.current?.open(鉢);
  };

  const 鉢を削除 = async (id: 鉢Id) => {
    const 鉢 = 鉢一覧.find(i => i.id === id);
    if (!鉢) return;
    console.log('削除を実行', id);
    await 鉢.削除();
  };

  return (
    <div className="鉢一覧">
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        {鉢一覧.map(鉢 => {
          return (
            <Col key={鉢.id} lg={2} sm={4} xs={8}>
              <鉢一覧の要素 item={鉢} 鉢を選択={鉢を選択} onDelete={鉢を削除} />
            </Col>
          );
        })}
      </Row>

      {/* 新規作成ボタン */}
      <div className="Section">
        <MyButton title={'⨁ 鉢を追加する'} onClick={鉢作成モーダルを開く} />
      </div>

      <鉢作成モーダル ref={鉢操作モーダルRef} 棚Id={棚Id} />
      <鉢管理モーダル ref={鉢管理モーダルRef} />
    </div>
  );
};
