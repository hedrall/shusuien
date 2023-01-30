import React from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from 'antd';

export type MyButtonProps = {
  className?: string;
  title: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  autoFocus?: boolean;
  isLoading?: boolean;
};

export const MyButton: React.FC<MyButtonProps> = props => {
  const { className, title, active = true, onClick, isLoading, ...rest } = props;

  const onClickHandler = () => {
    if (!active) return;
    onClick();
  };

  const buttonProps: ButtonProps = {
    className: cn('MyButton', className, { Active: active }),
    onClick,
    loading: isLoading,
    ...rest,
  };
  return <Button {...buttonProps}>{title}</Button>;
};
