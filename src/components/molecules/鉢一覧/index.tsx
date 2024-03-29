import React, { useRef } from 'react';
import './index.scss';
import { Col, notification, Row } from 'antd';
import { 棚 } from 'src/domain/entity/棚';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 鉢作成モーダル } from '@frontend/components/organisms/鉢作成モーダル';
import { use鉢一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢 } from 'src/domain/entity/鉢';
import { 鉢一覧の要素, 鉢一覧の要素Props } from '@frontend/components/atoms/ItemListCell';
import { 鉢管理モーダル } from 'src/components/organisms/鉢管理モーダル';
import dayjs from 'dayjs';
import { User } from 'src/domain/entity/user';
import { use灌水時の施肥有無設定 } from '@frontend/store/灌水時の施肥有無設定/action';

export type ItemListProps = {
  棚Id: 棚.Id;
};

export const 鉢一覧: React.FC<ItemListProps> = props => {
  const { 棚Id } = props;
  const { user } = useAuthState();
  const { 鉢一覧 } = use鉢一覧(棚Id, user);

  const viewProps: 鉢一覧ViewProps = { 鉢一覧, 棚Id, userId: user?.id };

  return <鉢一覧View {...viewProps} />;
};

type 鉢一覧ViewProps = {
  鉢一覧: 鉢[];
  棚Id: 棚.Id | undefined;
  userId: User.Id | undefined;
};
export const 鉢一覧View: React.FC<鉢一覧ViewProps> = props => {
  const { userId, 鉢一覧, 棚Id } = props;
  const 灌水ページから = !棚Id;

  // --- ref ---
  const 鉢操作モーダルRef = useRef<鉢作成モーダル.Ref | null>(null);
  const 鉢管理モーダルRef = useRef<鉢管理モーダル.Ref | null>(null);

  const 灌水時の施肥有無設定 = use灌水時の施肥有無設定();
  const [api, notElem] = notification.useNotification();

  const 鉢作成モーダルを開く = () => 鉢操作モーダルRef.current?.open();

  const 鉢を選択: 鉢一覧の要素Props['鉢を選択'] = async (item, type) => {
    console.log('鉢を選択', type);
    if (type === 'click') {
      鉢管理モーダルRef.current?.open(item);
      return;
    }

    // 一括灌水モードの場合
    const 最後の灌水 = item.snapshot.最後の灌水;
    if (最後の灌水 && 最後の灌水.日時.format('YYYYMMDD') === dayjs().format('YYYYMMDD')) {
      api.warning({ message: '本日灌水済みのためスキップします。', placement: 'bottomRight' });
      return;
    }
    if (!userId) return;
    await item.灌水({
      userId,
      灌水量: '鉢いっぱい',
      液肥入り: 灌水時の施肥有無設定.is,
    });
  };

  return (
    <div className="鉢一覧">
      {notElem}
      {灌水ページから ? null : <Row className="鉢数">鉢数: {鉢一覧.length}</Row>}
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        {鉢一覧.map(鉢 => {
          return (
            <Col key={鉢.id} lg={2} sm={4} xs={8}>
              <鉢一覧の要素 item={鉢} 鉢を選択={鉢を選択} />
            </Col>
          );
        })}
      </Row>
      {/* 新規作成ボタン */}
      {灌水ページから ? null : (
        <div className="Section 新規作成ボタンcontainer">
          <MyButton title={'⨁ 鉢を追加する'} onClick={鉢作成モーダルを開く} />
        </div>
      )}

      <鉢作成モーダル ref={鉢操作モーダルRef} 棚Id={棚Id} />
      <鉢管理モーダル ref={鉢管理モーダルRef} />
    </div>
  );
};
