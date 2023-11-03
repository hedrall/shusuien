import React from 'react';
import './index.scss';
import { Select, SelectProps } from 'antd';
import { 鉢 } from 'src/domain/entity/鉢';

export namespace 日光の強度Select {
  export type Props = {
    onChange: (v: 鉢.日光の強度) => void;
    value: 鉢.日光の強度 | undefined;
    isLoading?: boolean;
    size: SelectProps['size'];
    placeholder?: string;
  };
}

const 指定なし = '';
const 日光の強度一覧 = [...Object.values(鉢.日光の強度), { name: 指定なし }];
const options = 日光の強度一覧.map(i => ({ value: i.name, label: i.name }));

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
