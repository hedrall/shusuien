import React, { useRef } from 'react';
import { Collapse, List } from 'antd';
import { 棚 } from '@frontend/domain/model/tana';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 鉢作成モーダル } from '@frontend/components/organisms/CreateItemModal';
const { Panel } = Collapse;

export type ItemListProps = {
  棚: 棚;
  index: number;
};

export const 鉢一覧: React.FC<ItemListProps> = props => {
  const { 棚, index } = props;
  const ref = useRef<鉢作成モーダル.Ref | null>(null);

  const 鉢作成モーダルを開く = () => {
    ref.current?.open();
  };

  return (
    <div className="ItemList">
      <List size="small" bordered dataSource={[]} renderItem={棚 => <List.Item>{''}</List.Item>} />
      <div className="Section">
        <MyButton title={'⨁ 鉢を追加する'} onClick={鉢作成モーダルを開く} />
      </div>

      <鉢作成モーダル ref={ref} />
    </div>
  );
};
