import React, { MouseEvent, MouseEventHandler, useCallback, useRef } from 'react';
import './index.scss';
import { Image, ImageProps } from 'antd';
import { 鉢 } from 'src/domain/entity/鉢';
import { NO_IMAGE } from '@frontend/supports/image';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import dayjs from 'dayjs';
import { x日前の表記 } from '@frontend/supports';
import { isDefined, optionalCall } from '@frontend/supports/functions';
import cn from 'classnames';
import { 現在の季節 } from '@frontend/domain/const/季節';
import { onKeyEnter } from '@frontend/supports/keyboardAction';
import { 水切れのデフォルト日数 } from '@frontend/supports/settings';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢, eventType: 'click' | 'doubleClick') => void;
  style?: {
    // グレースケールで表示する
    grey?: boolean;
    // 画像に被せて見せるアイテム
    overlapItem?: React.ReactNode;
  };
};

type Color = readonly [number, number, number];
export const グラデーション生成 = (startColor: Color, endColor: Color, index: number, 分割数: number) => {
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
  const { item, 鉢を選択, style } = props;
  const _鉢を選択 = 鉢を選択.bind(null, item);
  const bind = useDoubleTap(() => _鉢を選択('doubleClick'), 300, {
    onSingleTap: () => _鉢を選択('click'),
  });
  const { 最後の灌水: _灌水 } = item.snapshot;
  const { 耐寒温度, 日光の強度設定: _強度, 水切れ日数: _水切れ日数 } = item.詳細;
  const 水切れ日数 = _水切れ日数 || 水切れのデフォルト日数;
  const 最後の灌水 = _灌水?.日時;
  const 経過日数 = {
    最後の灌水: optionalCall(最後の灌水, v => x日前の表記(dayjs(), v)) || '',
    最後の液肥: optionalCall(item.snapshot.最後の液肥.日時, v => x日前の表記(dayjs(), v)) || '',
  } as const;

  const 日光の強度設定 = _強度?.[現在の季節];
  const 上部補足情報 = (() => {
    const msg: string[] = [];
    if (isDefined(耐寒温度)) msg.push(`🌡${耐寒温度}℃`);
    if (isDefined(日光の強度設定)) msg.push(`☀️${鉢.日光の強度[日光の強度設定].短縮表現}`);
    return msg.join();
  })();

  const imageContainerProps = {
    className: 'ImageContainer',
    onContextMenu: (e: any) => {
      e.preventDefault();
    },
    ...bind,
    ...onKeyEnter(() => _鉢を選択('click')),
  };
  const imageProps: ImageProps = {
    className: cn('鉢一覧の要素', { GreyScale: style?.grey }),
    preview: false,
    src: item.snapshot.small画像のURL || item.snapshot.画像のURL || NO_IMAGE,
    style: { borderRadius: 7, aspectRatio: '1', objectFit: 'cover' },
    role: 'button',
    tabIndex: 0,
  };

  return (
    <div
      className={cn('鉢一覧の要素')}
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div {...imageContainerProps}>
        <Image {...imageProps} />
        {style?.overlapItem ? <div className="OverlapItem">{style.overlapItem}</div> : null}
      </div>
      {上部補足情報 ? <span className="上部補足情報 表示">{上部補足情報}</span> : null}
      {経過日数.最後の灌水 ? (
        <span
          className="最後の灌水からの経過日数 表示"
          style={{ color: 経過日数アラート色(経過日数.最後の灌水.日数, 水切れ日数) }}
        >
          <ICONS.灌水 />
          {経過日数.最後の灌水.表記}
        </span>
      ) : null}
      {経過日数.最後の液肥 ? (
        <span className="最後の液肥からの経過日数 表示">
          <OPERATION_ICONS.肥料 />
          {経過日数.最後の液肥.表記}
        </span>
      ) : null}
      {item.snapshot.植替待ち && (
        <span className="植替待ち 表示">
          <ICONS.植替待設定 /> 植替待ち
        </span>
      )}
    </div>
  );
};
