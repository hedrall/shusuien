import React from 'react';
import { useFilter } from '@frontend/store/filter/action';
import { Col, Input, InputProps, Row, Slider } from 'antd';
import { useController, useForm } from 'react-hook-form';
import { 日光の強度 } from '@frontend/domain/model/item';
import { SliderRangeProps } from 'antd/es/slider';
import { optionalValue } from '@frontend/supports/functions';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { MyInput } from '@frontend/components/atoms/MyInput';

namespace FilterInput {
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

export const FilterInput: React.FC<FilterInput.Props> = props => {
  const { filter, set } = useFilter();

  const sliderProps: SliderRangeProps = {
    range: true,
    value: [optionalValue(filter.耐寒温度?.start, -11), optionalValue(filter.耐寒温度?.end, 41)],
    max: 41,
    min: -11,
    step: 1,
    onChange: e => set.耐寒温度(e[0] === -11 ? undefined : e[0], e[1] === 41 ? undefined : e[1]),
    marks: {
      '-11': '下限なし',
      0: '0°C',
      10: '10°C',
      20: '21°C',
      30: '30°C',
      41: '上限なし',
    },
    style: { width: '100%' },
  };

  const 強度 = filter.日光の強度;
  const 日光の強度SelectProps: 日光の強度Select.Props = {
    onChange: e => set.日光の強度(e as 日光の強度),
    value: 強度,
    size: 'small',
  };
  const keywordInputProps: InputProps = {
    value: filter.keyword,
    onChange: e => set.keyword(e.target.value),
    size: 'small',
  };

  return (
    <div className="FilterInput">
      <Row>
        <label>耐寒温度</label>
        <Slider {...sliderProps} />
      </Row>
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <label>日光の強度</label>
          <日光の強度Select {...日光の強度SelectProps} />
        </Col>
        <Col span={12}>
          <label>キーワード</label>
          <Input {...keywordInputProps} />
        </Col>
      </Row>
      <pre>{JSON.stringify(filter, null, 2)}</pre>
    </div>
  );
};
