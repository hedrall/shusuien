import React, { useMemo } from 'react';
import { Dropdown, Image, ImageProps, MenuProps, Popconfirm } from 'antd';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import dayjs from 'dayjs';
import { x日前の表記 } from '@frontend/supports';
import { optionalCall } from '@frontend/supports/functions';
import cn from 'classnames';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢) => void;
  onDelete: (id: 鉢Id) => Promise<void>;
  一括灌水モード: boolean;
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

type Color = readonly [number, number, number];
const グラデーション生成 = (startColor: Color, endColor: Color, index: number, 分割数: number) => {
  const color = startColor.map((start, i) => {
    const end = endColor[i];
    return start + ((end - start) / 分割数) * index;
  });
  return `rgb(${color.join()})`;
};
const blue = [0, 99, 248] as const;
const grey = [82, 82, 82] as const;
const red = [255, 44, 44] as const;
const 経過日数アラート色 = (_経過日数: number): string => {
  const 経過日数 = _経過日数 + 1;
  if (経過日数 <= 7 /* 1 ~ 7 の7段階 */) {
    return グラデーション生成(blue, grey, 経過日数, 7);
  }
  // 8 ~ 30 の24段階
  return グラデーション生成(grey, red, Math.max(経過日数, 30) - 7, 24);
};
export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択, onDelete, 一括灌水モード } = props;

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
      <div className={cn('鉢一覧の要素', { 一括灌水モード })}>
        <Image {...imageProps} />
        {最後の灌水からの経過日数 ? (
          <span
            className="最後の灌水からの経過日数"
            style={{ color: 経過日数アラート色(最後の灌水からの経過日数.日数) }}
          >
            <ICONS.灌水 />
            {最後の灌水からの経過日数.表記}
          </span>
        ) : null}
      </div>
    </Dropdown>
  );
};
