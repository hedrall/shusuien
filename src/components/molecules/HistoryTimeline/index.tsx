import React from 'react';
import { use鉢の履歴一覧 } from '@frontend/hooks/itemHistory';
import { 鉢 } from '@frontend/domain/model/item';
import { useAuthState } from '@frontend/store/auth/action';
import { Timeline, TimelineProps } from 'antd';
import { 履歴, 履歴の内容, 鉢サイズ } from '@frontend/domain/model/history';
import { ICONS } from '@frontend/supports/icons';

export type 鉢の履歴Props = {
  鉢: 鉢 | undefined;
};

type TLItem = {
  color?: string;
  dot?: React.ReactNode;
  children: React.ReactNode;
};
const 履歴ごとの色 = (type: 履歴の内容.Type) => {
  switch (type) {
    case '画像を更新':
    case '成長の記録':
      return 'grey';
    case '植替え':
      return 'red';
    case '灌水':
      return 'blue';
  }
};

const 履歴ごとの表示内容 = (i: 履歴): React.ReactNode => {
  const 一行目 = `[${i.作成日時.format(F)}]: ${i.内容.type}`;
  switch (i.内容.type) {
    case '画像を更新':
    case '成長の記録':
      return 一行目;
    case '灌水':
      return (
        <div>
          <p className="ItemP">{一行目}</p>
          <p className="ItemP">{i.内容.灌水量}</p>
        </div>
      );
    case '植替え':
      return (
        <div>
          <p className="ItemP">{一行目}</p>
          <p className="ItemP">サイズ: {鉢サイズ.toString(i.内容.鉢のサイズ)}</p>
        </div>
      );
  }
};

const F = 'YYYY/MM/DD HH時';
const Timelineのアイテムへ変換 = (i: 履歴): TLItem => {
  const Icon = ICONS[i.内容.type];
  return {
    children: 履歴ごとの表示内容(i),
    dot: <Icon />,
    // color: 履歴ごとの色(i.内容.type),
    color: 'grey',
  };
};

export const 鉢の履歴: React.FC<鉢の履歴Props> = props => {
  const { 鉢 } = props;
  const { user } = useAuthState();
  const 履歴一覧 = use鉢の履歴一覧(鉢?.id, user?.id);

  const timeLineProps: TimelineProps = {
    className: '鉢の履歴',
    items: 履歴一覧.map(Timelineのアイテムへ変換),
  };

  return <Timeline {...timeLineProps} />;
};
