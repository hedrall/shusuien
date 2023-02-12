import { Radio, Space } from 'antd';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

type D = string | number;
type Option<T extends D> = {
  name: string;
  value: T;
};
export type VerticalRadioGroupOption<T extends D> = Option<T>;

export type VerticalRadioGroupProps<T extends D> = {
  field: ControllerRenderProps<any, any>;
  options: Option<T>[];
};

export function VerticalRadioGroup<T extends D>(props: VerticalRadioGroupProps<T>) {
  const { field, options } = props;

  return (
    <Radio.Group className="VerticalRadioGroup" buttonStyle="solid" {...field}>
      <Space direction="vertical">
        {options.map(({ value, name }) => {
          return (
            <Radio.Button key={value} value={value}>
              {name}
            </Radio.Button>
          );
        })}
      </Space>
    </Radio.Group>
  );
}
