import { Radio } from 'antd';
import React from 'react';
import './index.scss';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type D = string | number;
type Option<T extends D> = {
  name: string;
  value: T;
};
export type RadioGroupOption<T extends D> = Option<T>;

export type RadioGroupProps<T extends D> = {
  field: ControllerRenderProps<any, any>;
  options: Option<T>[];
  size?: SizeType;
};

export function RadioGroup<T extends D>(props: RadioGroupProps<T>) {
  const { field, options, size } = props;

  return (
    <Radio.Group className="RadioGroup" size={size} buttonStyle="solid" {...field}>
      {options.map(({ value, name }) => {
        return (
          <Radio.Button key={value} value={value}>
            {name}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
}
