import React from 'react';
import cn from 'classnames';
import { Path, UseControllerReturn } from 'react-hook-form';
import { Input } from 'antd';

export type PasswordInputProps<Inputs extends Record<string, any>, Name extends Path<Inputs>> = {
  controller: UseControllerReturn<Inputs, Name>;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export function PasswordInput<Inputs extends Record<string, any>, Name extends Path<Inputs>>(
  props: PasswordInputProps<Inputs, Name>,
) {
  const { className, controller, ...rest } = props;
  return (
    <Input.Password {...rest} className={cn('MyInput', className)} {...controller.field} placeholder="パスワード" />
  );
}
