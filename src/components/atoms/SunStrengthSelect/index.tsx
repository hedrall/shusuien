import React from 'react';
import './index.scss';
import { 日光の強度 } from '@frontend/domain/model/鉢';
import { Select, SelectProps } from 'antd';

export namespace 日光の強度Select {
  export type Props = {
    onChange: (v: 日光の強度) => void;
    value: 日光の強度 | undefined;
    isLoading?: boolean;
    size: SelectProps['size'];
    placeholder?: string;
  };
}

const 指定なし = '';
const 日光の強度一覧 = [...Object.values(日光の強度), 指定なし];
const options = 日光の強度一覧.map(i => ({ value: i, label: i }));

export const 日光の強度Select: React.FC<日光の強度Select.Props> = props => {
  const { onChange, value, isLoading, size, placeholder } = props;
  const selectProps: SelectProps = {
    options,
    onChange,
    value,
    loading: isLoading,
    style: { width: '100%' },
    size,
    placeholder,
  };
  return <Select className="日光の強度Select" {...selectProps} />;
};
