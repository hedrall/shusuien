import { Switch } from 'antd';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

export type MySwitchProps = {
  field: ControllerRenderProps<any, any>;
};

export const MySwitch: React.FC<MySwitchProps> = props => {
  const { field } = props;
  const { value, ...rest } = field;
  return <Switch className="MySwitch" {...rest} checked={value} />;
};
