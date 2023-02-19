import React, { useRef } from 'react';
import { Col, notification, Row } from 'antd';
import { 棚 } from '@frontend/domain/model/tana';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 鉢作成モーダル } from '@frontend/components/organisms/CreateItemModal';
import { use鉢一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { 鉢一覧の要素 } from '@frontend/components/atoms/ItemListCell';
import { 鉢管理モーダル } from '@frontend/components/organisms/OperateItemModal';
import { use一括灌水モード設定 } from '@frontend/store/operation/action';
import dayjs from 'dayjs';

export type ItemListProps = {
  棚: 棚;
};

export const 鉢一覧: React.FC<ItemListProps> = props => {
  const { 棚 } = props;
  const 鉢操作モーダルRef = useRef<鉢作成モーダル.Ref | null>(null);
  const 鉢管理モーダルRef = useRef<鉢管理モーダル.Ref | null>(null);
  const { user } = useAuthState();
  const 一括灌水モード設定 = use一括灌水モード設定();
  const [api, notElem] = notification.useNotification();

  const 棚Id = 棚.id!;
  const { 鉢一覧 } = use鉢一覧(棚Id, user);

  const 鉢作成モーダルを開く = () => 鉢操作モーダルRef.current?.open();

  const 鉢を選択 = async (item: 鉢) => {
    if (!一括灌水モード設定.state.ON) {
      鉢管理モーダルRef.current?.open(item);
      return;
    }
    const 最後の灌水 = item.snapshot.最後の灌水;
    if (最後の灌水 && 最後の灌水.日時.format('YYYYMMDD') === dayjs().format('YYYYMMDD')) {
      api.warning({ message: '本日灌水済みのためスキップします。', placement: 'bottomRight' });
      return;
    }
    if (!user) return;
    await 鉢.管理.灌水({
      item,
      userId: user.id,
      灌水量: 一括灌水モード設定.state.灌水量,
    });
  };

  const 鉢を削除 = async (id: 鉢Id) => {
    const 鉢 = 鉢一覧.find(i => i.id === id);
    if (!鉢) return;
    console.log('削除を実行', id);
    await 鉢.削除();
  };

  return (
    <div className="鉢一覧">
      {notElem}
      <Row className="鉢数">鉢数: {鉢一覧.length}</Row>
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        {鉢一覧.map(鉢 => {
          return (
            <Col key={鉢.id} lg={2} sm={4} xs={8}>
              <鉢一覧の要素
                item={鉢}
                鉢を選択={鉢を選択}
                onDelete={鉢を削除}
                一括灌水モード={一括灌水モード設定.state.ON}
              />
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
