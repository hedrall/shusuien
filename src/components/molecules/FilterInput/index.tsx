import React, { useState } from 'react';
import './index.scss';
import { useFilter } from '@frontend/store/filter/action';
import { Col, Input, InputNumber, InputNumberProps, InputProps, Row, Slider } from 'antd';
import { SliderRangeProps } from 'antd/es/slider';
import { optionalValue } from '@frontend/supports/functions';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { SYMBOL_ICONS } from '@frontend/supports/icons';
import cn from 'classnames';
import { DebugOnly } from '@frontend/components/atoms/DebugOnly';
import { onClickOrEnter, onKeyEnter } from '@frontend/supports/keyboardAction';
import { 日光の強度 } from 'src/domain/model/鉢/日光の強度';

namespace フィルタ条件の入力 {
  export type Props = {};
  export type Input = {
    耐寒温度: {
      start?: number;
      end?: number;
    };
    日光の強度?: 日光の強度;
    keyword?: string;
  };
}

const DEFAULT_VALUES = () => ({
  耐寒温度: {
    start: undefined,
    end: undefined,
  },
  耐寒温度End: undefined,
  日光の強度: undefined,
  keyword: undefined,
});

export const フィルタ条件の入力: React.FC<フィルタ条件の入力.Props> = props => {
  const { filter, set } = useFilter();
  const [詳細を表示, set詳細を表示] = useState(false);

  const 下限なし = -11;
  const 上限なし = 16;
  const sliderProps: SliderRangeProps = {
    range: true,
    value: [optionalValue(filter.耐寒温度?.start, 下限なし), optionalValue(filter.耐寒温度?.end, 上限なし)],
    max: 上限なし,
    min: 下限なし,
    step: 1,
    onChange: e => set.耐寒温度(e[0] === 下限なし ? undefined : e[0], e[1] === 上限なし ? undefined : e[1]),
    marks: {
      [下限なし]: '下限なし',
      '-5': '-5°C',
      0: '0°C',
      5: '5°C',
      10: '10°C',
      [上限なし]: '上限なし',
    },
    style: { width: '100%' },
    tooltip: {
      formatter: value => {
        if (value === 下限なし) return '下限なし';
        if (value === 上限なし) return '上限なし';
        return `${value}℃`;
      },
    },
  };

  const 強度 = filter.日光の強度;
  const 日光の強度SelectProps: 日光の強度Select.Props = {
    onChange: e => set.日光の強度(e ? (e as 日光の強度) : undefined),
    value: 強度,
    size: 'small',
  };

  const keywordInputProps: InputProps = {
    value: filter.keyword,
    onChange: e => set.keyword(e.target.value),
    size: 'small',
    allowClear: true,
  };
  const 最後の灌水からの経過日数InputProps: InputNumberProps = {
    value: filter.最後の灌水からの経過日数?.start,
    onChange: value => {
      set.最後の灌水からの経過日数(optionalValue(value, undefined) as number | undefined);
    },
    size: 'small',
    min: 0,
    max: 365,
    type: 'number',
  };

  return (
    <div className="フィルタ条件の入力">
      {filter.enabled ? (
        <div className="クリアボタン" role="button" tabIndex={0} {...onClickOrEnter(set.clear)}>
          <div>
            <SYMBOL_ICONS.CLEAR /> <span>クリア</span>
          </div>
        </div>
      ) : null}
      <Row gutter={[16, 0]} className="メイン" align="bottom">
        <Col span={8}>
          <label>キーワード</label>
          <Input {...keywordInputProps} />
        </Col>
        <Col span={8}>
          <label>最後の灌水から</label>
          <div className="最後の灌水からの経過日数">
            <InputNumber type="number" {...最後の灌水からの経過日数InputProps} />
            <div tabIndex={0} role="button" {...onClickOrEnter(() => set.最後の灌水からの経過日数(undefined))}>
              <SYMBOL_ICONS.CLEAR />
            </div>
          </div>
        </Col>
        <Col span={8}>
          <p
            onClick={() => set詳細を表示(pre => !pre)}
            className={cn('開閉ボタン', { Open: 詳細を表示 })}
            role="button"
            tabIndex={0}
          >
            詳細な条件 <SYMBOL_ICONS.UP />
          </p>
        </Col>
      </Row>
      <Row className="詳細">
        {詳細を表示 ? (
          <div className={cn('コンテナ', { Open: 詳細を表示 })}>
            <Row gutter={[16, 0]}>
              <Col span={8}>
                <label>日光の強度</label>
                <日光の強度Select {...日光の強度SelectProps} />
              </Col>
            </Row>
            <Row className="耐寒温度Section">
              <label>耐寒温度</label>
              <div className="耐寒温度Slider">
                <Slider {...sliderProps} />
              </div>
            </Row>
          </div>
        ) : null}
      </Row>
      <DebugOnly>
        <pre>{JSON.stringify(filter, null, 2)}</pre>
      </DebugOnly>
    </div>
  );
};
