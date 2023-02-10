import React, { useEffect, useRef, useState } from 'react';
import { Collapse, Image, List } from 'antd';
import { 棚 } from '@frontend/domain/model/tana';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 鉢作成モーダル } from '@frontend/components/organisms/CreateItemModal';
import { use鉢 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢 } from '@frontend/domain/model/item';
import { StorageRepository } from '@frontend/domain/repository/storage';

const { Panel } = Collapse;

export type ItemListProps = {
  棚: 棚;
};

const ListItem: React.FC<{ 鉢: 鉢 }> = props => {
  const { 鉢 } = props;
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const path = 鉢.snapshot.画像のPATH;
    if (!path) return;
    StorageRepository.getDownloadUrls(path).then(setImageUrl);
  }, [鉢]);

  return (
    <List.Item>
      <Image src={imageUrl} />
    </List.Item>
  );
};
export const 鉢一覧: React.FC<ItemListProps> = props => {
  const { 棚 } = props;
  const ref = useRef<鉢作成モーダル.Ref | null>(null);
  const { user } = useAuthState();

  const 棚Id = 棚.id!;
  const { 鉢一覧, 鉢を購読 } = use鉢(棚Id);

  useEffect(() => {
    if (!user?.id) return;
    const { unsubscribe } = 鉢を購読(user.id, 棚Id);
    return () => unsubscribe();
  }, [user?.id, 棚Id]);

  const 鉢作成モーダルを開く = () => ref.current?.open();

  return (
    <div className="鉢一覧">
      <List size="small" bordered dataSource={鉢一覧} renderItem={鉢 => <ListItem 鉢={鉢} />} />

      {/* 新規作成ボタン */}
      <div className="Section">
        <MyButton title={'⨁ 鉢を追加する'} onClick={鉢作成モーダルを開く} />
      </div>

      <鉢作成モーダル ref={ref} 棚Id={棚Id} />
    </div>
  );
};
