import React, { MouseEvent, MouseEventHandler, useCallback, useMemo, useRef } from 'react';
import { Dropdown, Image, ImageProps, MenuProps, Popconfirm } from 'antd';
import { 日光の強度の短縮表現, 鉢, 鉢Id } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import dayjs from 'dayjs';
import { x日前の表記 } from '@frontend/supports';
import { isDefined, optionalCall } from '@frontend/supports/functions';
import cn from 'classnames';
import { 現在の季節 } from '@frontend/domain/const/season';
import { onKeyEnter } from '@frontend/supports/keyboardAction';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢, eventType: 'click' | 'doubleClick') => void;
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
    return Math.ceil(start + ((end - start) / 分割数) * index);
  });
  return `rgb(${color.join()})`;
};
const blue = [0, 99, 248] as const;
const 水切れ色 = [82, 82, 82] as const;
const アラート色 = [255, 44, 44] as const;
/**
 * 水切れ日数が3の時
 * 1, 2, 3(水切れ色), 4, 5, 6(アラート色)
 */
const 経過日数アラート色 = (_経過日数: number, 水切れ日数 = 14): string => {
  let 経過日数 = _経過日数 + 1; /* 1, 2, 3, ... */
  if (経過日数 <= 水切れ日数 /* 1 ~ 7 の7段階 */) {
    return グラデーション生成(blue, 水切れ色, 経過日数, 水切れ日数);
  }
  経過日数 -= 水切れ日数; /* 1(8), 2(9), 3(10), ... */
  // 8 ~ 14 の7段階
  return グラデーション生成(水切れ色, アラート色, 経過日数, 水切れ日数);
};

type EmptyCallback = () => void;

export type CallbackFunction<Target = Element> = MouseEventHandler<Target> | EmptyCallback;

export type DoubleTapCallback<Target = Element> = CallbackFunction<Target> | null;

export interface DoubleTapOptions<Target = Element> {
  onSingleTap?: CallbackFunction<Target>;
}

export type DoubleTapResult<Target, Callback> = Callback extends CallbackFunction<Target>
  ? {
      onClick: CallbackFunction<Target>;
    }
  : Callback extends null
  ? {}
  : never;

export function useDoubleTap<Target = Element, Callback extends DoubleTapCallback<Target> = DoubleTapCallback<Target>>(
  callback: Callback,
  threshold = 300,
  options: DoubleTapOptions<Target> = {},
): DoubleTapResult<Target, Callback> {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback<CallbackFunction<Target>>(
    (event: MouseEvent<Target>) => {
      if (!timer.current) {
        timer.current = setTimeout(() => {
          if (options.onSingleTap) {
            options.onSingleTap(event);
          }
          timer.current = null;
        }, threshold);
      } else {
        clearTimeout(timer.current);
        timer.current = null;
        callback && callback(event);
      }
    },
    [callback, threshold, options.onSingleTap],
  );

  return (
    callback
      ? {
          onClick: handler,
        }
      : {}
  ) as DoubleTapResult<Target, Callback>;
}

export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択, onDelete, 一括灌水モード } = props;
  const _鉢を選択 = 鉢を選択.bind(null, item);
  const bind = useDoubleTap(() => _鉢を選択('doubleClick'), 300, {
    onSingleTap: () => _鉢を選択('click'),
  });
  const { 最後の灌水: _灌水 } = item.snapshot;
  const { 耐寒温度, 日光の強度設定: _強度, 水切れ日数 } = item.詳細;
  const 最後の灌水 = _灌水?.日時;
  const 最後の灌水からの経過日数 = optionalCall(最後の灌水, v => x日前の表記(dayjs(), v)) || '';
  const 日光の強度設定 = _強度?.[現在の季節];
  const 上部補足情報 = (() => {
    const msg: string[] = [];
    if (isDefined(耐寒温度)) msg.push(`🌡${耐寒温度}℃`);
    if (isDefined(日光の強度設定)) msg.push(`☀️${日光の強度の短縮表現[日光の強度設定]}`);
    return msg.join();
  })();

  const imageProps: ImageProps = {
    className: '鉢一覧の要素',
    preview: false,
    src: item.snapshot.small画像のURL || item.snapshot.画像のURL || NO_IMAGE,
    style: { borderRadius: 7, aspectRatio: '1', objectFit: 'cover' },
    onContextMenu: e => {
      e.preventDefault();
    },
    ...bind,
    role: 'button',
    tabIndex: 0,
    ...onKeyEnter(() => _鉢を選択('click')),
  };

  const items = useMemo(() => {
    return getItems({ onDelete: () => onDelete(item.id!) });
  }, [item.id]);

  return (
    <Dropdown trigger={['contextMenu']} menu={{ items }}>
      <div
        className={cn('鉢一覧の要素', { 一括灌水モード })}
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Image {...imageProps} />
        {上部補足情報 ? <span className="上部補足情報 表示">{上部補足情報}</span> : null}
        {最後の灌水からの経過日数 ? (
          <span
            className="最後の灌水からの経過日数 表示"
            style={{ color: 経過日数アラート色(最後の灌水からの経過日数.日数, 水切れ日数) }}
          >
            <ICONS.灌水 />
            {最後の灌水からの経過日数.表記}
          </span>
        ) : null}
      </div>
    </Dropdown>
  );
};
