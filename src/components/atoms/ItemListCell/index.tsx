import React, { useMemo } from 'react';
import { Dropdown, Image, ImageProps, MenuProps, Popconfirm } from 'antd';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import dayjs from 'dayjs';
import { x日前の表記 } from '@frontend/supports';
import { optionalCall } from '@frontend/supports/functions';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢) => void;
  onDelete: (id: 鉢Id) => Promise<void>;
};

const getItems = (p: { onDelete: () => void }): MenuProps['items'] => [
  {
    label: (
      <Popconfirm title="本当に削除してもよろしいですか？" onConfirm={p.onDelete} okText="削除" cancelText="キャンセル">
        <span>
          <OPERATION_ICONS.DELETE style={{ marginRight: 4 }} />
          削除
        </span>
      </Popconfirm>
    ),
    key: '0',
    onClick: () => {
      /* do nothing */
    },
  },
];

export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択, onDelete } = props;

  const 最後の灌水 = item.snapshot.最後の灌水?.日時;
  const 最後の灌水からの経過日数 = optionalCall(最後の灌水, v => x日前の表記(dayjs(), v)) || '';
  const imageProps: ImageProps = {
    className: '鉢一覧の要素',
    preview: false,
    src: item.snapshot.small画像のURL || item.snapshot.画像のURL || NO_IMAGE,
    style: { borderRadius: 7, aspectRatio: '1', objectFit: 'cover' },
    onClick: () => 鉢を選択(item),
    onContextMenu: e => {
      e.preventDefault();
    },
  };

  const items = useMemo(() => {
    return getItems({ onDelete: () => onDelete(item.id!) });
  }, [item.id]);

  return (
    <Dropdown trigger={['contextMenu']} menu={{ items }}>
      <div className="鉢一覧の要素">
        <Image {...imageProps} />
        {最後の灌水からの経過日数 ? (
          <span className="最後の灌水からの経過日数">
            <ICONS.灌水 />
            {最後の灌水からの経過日数}
          </span>
        ) : null}
      </div>
    </Dropdown>
  );
};
