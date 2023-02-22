import React from 'react';
import { Alert, AlertProps, InputProps } from 'antd';
import { Path, UseControllerReturn } from 'react-hook-form';
import { MyInput } from '@frontend/components/atoms/MyInput';

export type MyInputPropsWithAlert<Inputs extends Record<string, any>, Name extends Path<Inputs>> = {
  controller: UseControllerReturn<Inputs, Name>;
  inputProps?: InputProps;
  alertProps?: AlertProps;
};

export function MyInputWithAlert<Inputs extends Record<string, any>, Name extends Path<Inputs>>(
  props: MyInputPropsWithAlert<Inputs, Name>,
) {
  const { controller, inputProps, alertProps: _ap } = props;

  const errorMessage = controller.fieldState.error?.message;
  const alertProps: AlertProps = {
    type: 'error',
    showIcon: true,
    message: errorMessage,
    ..._ap,
  };

  return (
    <div className="MyInputWithAlert">
      <MyInput controller={controller} {...inputProps} />
      {errorMessage ? <Alert {...alertProps} /> : undefined}
    </div>
  );
}
