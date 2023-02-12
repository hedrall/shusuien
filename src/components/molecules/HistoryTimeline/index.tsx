import React from 'react';
import { use鉢の履歴一覧 } from '@frontend/hooks/itemHistory';
import { 鉢 } from '@frontend/domain/model/item';
import { useAuthState } from '@frontend/store/auth/action';
import { Image, Timeline, TimelineProps } from 'antd';
import { 履歴, 履歴の内容, 鉢サイズ } from '@frontend/domain/model/history';
import { ICONS } from '@frontend/supports/icons';
import { useController, useForm } from 'react-hook-form';
import { 履歴のタイプでの絞り込みフィルターグループ } from '@frontend/components/atoms/HistoryTypeFilterButtonGroup';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { NO_IMAGE } from '@frontend/supports/image';

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
    case '成長の記録':
      return 'grey';
    case '植替え':
      return 'red';
    case '灌水':
      return 'blue';
  }
};

function 画像と表示(props: { 一行目: string; 二行目?: string; 画像のPATH: string }) {
  const { 一行目, 二行目, 画像のPATH } = props;
  const { imageUrl } = StorageRepository.鉢.use画像(画像のPATH);
  return (
    <div>
      <p className="Item行">{一行目}</p>
      {二行目 ? <p className="Item行">{二行目}</p> : null}
      <Image style={{ maxWidth: '100%', maxHeight: 80, minHeight: 80 }} src={imageUrl || NO_IMAGE} />
    </div>
  );
}

const 履歴ごとの表示内容 = (i: 履歴): React.ReactNode => {
  const 一行目 = `[${i.作成日時.format(F)}]: ${i.内容.type}`;
  switch (i.内容.type) {
    case '成長の記録': {
      return <画像と表示 一行目={一行目} 画像のPATH={i.内容.画像のPATH} />;
    }
    case '灌水':
      return (
        <div>
          <p className="Item行">{一行目}</p>
          <p className="Item行">{i.内容.灌水量}</p>
        </div>
      );
    case '植替え':
      return (
        <画像と表示
          一行目={一行目}
          二行目={鉢サイズ.toString(i.内容.鉢のサイズ)}
          画像のPATH={i.内容.植替え後の画像のPATH}
        />
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

type Input = {
  filter: 履歴の内容.Type[];
};
const DEFAULT_VALUES = (): Input => {
  return { filter: [] };
};

export const 鉢の履歴: React.FC<鉢の履歴Props> = props => {
  const { 鉢 } = props;
  const { user } = useAuthState();
  const { control, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES(),
  });
  const 履歴一覧 = use鉢の履歴一覧(鉢?.id, user?.id, {
    filter: getValues().filter,
  });

  const filter = useController({
    control,
    name: 'filter',
  });

  const timeLineProps: TimelineProps = {
    items: 履歴一覧.map(Timelineのアイテムへ変換),
  };

  return (
    <div className="鉢の履歴">
      <div className="FilterWrapper">
        <履歴のタイプでの絞り込みフィルターグループ field={filter.field} />
      </div>
      <Timeline {...timeLineProps} />
    </div>
  );
};
