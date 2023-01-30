import React from 'react';
import cn from 'classnames';
import { Input, InputProps } from 'antd';
import { Path, UseControllerReturn } from 'react-hook-form';

export type MyInputProps<Inputs extends Record<string, any>, Name extends Path<Inputs>> = {
  controller: UseControllerReturn<Inputs, Name>;
} & InputProps;

export function MyInput<Inputs extends Record<string, any>, Name extends Path<Inputs>>(
  props: MyInputProps<Inputs, Name>,
) {
  const { className, controller, ...rest } = props;
  return <Input className={cn('MyInput', className)} {...controller.field} {...rest} />;
}
