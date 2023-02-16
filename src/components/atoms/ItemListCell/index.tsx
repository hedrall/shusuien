import React, { useMemo } from 'react';
import { Avatar, AvatarProps, Dropdown, Image, ImageProps, MenuProps, Popconfirm } from 'antd';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';
import { OPERATION_ICONS } from '@frontend/supports/icons';
import dayjs, { Dayjs } from 'dayjs';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢) => void;
  onDelete: (id: 鉢Id) => Promise<void>;
  最古の最後の灌水: Dayjs;
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
  // {
  //   label: <a href="https://www.antgroup.com">1st menu item</a>,
  //   key: '0',
  // },
  // {
  //   label: <a href="https://www.aliyun.com">2nd menu item</a>,
  //   key: '1',
  // },
  // {
  //   type: 'divider',
  // },
];

// 最後の灌水 = undefined の場合は undefined
// (現在 - 最後の灌水) / (現在 - 最古の灌水)
const get灌水ゲージ = (最後の灌水: Dayjs | undefined, 最古の最後の灌水: Dayjs) => {
  if (!最後の灌水) return;
  const now = dayjs();
  return now.diff(最後の灌水) / now.diff(最古の最後の灌水);
};
export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択, onDelete, 最古の最後の灌水 } = props;

  const 灌水ゲージ = get灌水ゲージ(item.snapshot.最後の灌水?.日時, 最古の最後の灌水);
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
        {/*<span className="灌水ゲージ">ゲージ: {灌水ゲージ}</span>*/}
      </div>
    </Dropdown>
  );
};
