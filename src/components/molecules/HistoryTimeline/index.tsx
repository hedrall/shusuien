import React from 'react';
import { use鉢の履歴一覧 } from '@frontend/hooks/itemHistory';
import { 鉢 } from '@frontend/domain/model/item';
import { useAuthState } from '@frontend/store/auth/action';
import { Timeline, TimelineProps } from 'antd';
import { 履歴, 履歴の内容 } from '@frontend/domain/model/history';
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

const F = 'YYYY/MM/DD HH時';
const Timelineのアイテムへ変換 = (i: 履歴): TLItem => {
  const Icon = ICONS[i.内容.type];
  return {
    children: `[${i.作成日時.format(F)}]: ${i.内容.type}`,
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
    className: '',
    items: 履歴一覧.map(Timelineのアイテムへ変換),
  };

  return <Timeline {...timeLineProps} />;
};
