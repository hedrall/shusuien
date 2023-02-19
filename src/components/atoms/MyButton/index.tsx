import React from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from 'antd';

export type MyButtonProps = Omit<ButtonProps, 'title'> & {
  className?: string;
  title: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  autoFocus?: boolean;
  color?: string;
  isLoading?: boolean;
};

export const MyButton: React.FC<MyButtonProps> = props => {
  const { className, title, active = true, onClick, isLoading, color, ...rest } = props;

  const buttonProps: ButtonProps = {
    className: cn('MyButton', className, { Active: active }),
    onClick,
    loading: isLoading,
    color,
    ...rest,
  };
  return <Button {...buttonProps}>{title}</Button>;
};
