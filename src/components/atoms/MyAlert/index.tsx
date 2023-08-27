import React from 'react';
import './index.scss';
import cn from 'classnames';
import { Alert, AlertProps } from 'antd';

export type MyAlertProps = {
  className?: string;
  active: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export const MyAlert: React.FC<MyAlertProps> = props => {
  const { className, active, title, description } = props;

  if (!active) return null;

  const alertProps: AlertProps = {
    className: cn('MyAlert', className),
    type: 'error',
    showIcon: true,
    message: title,

    description,
  };

  return <Alert {...alertProps} />;
};
