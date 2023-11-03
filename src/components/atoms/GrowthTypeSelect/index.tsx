import React from 'react';
import { Select, SelectProps } from 'antd';
import { 育成タイプ } from 'src/domain/entity/鉢/育成タイプ';

export namespace 育成タイプSelect {
  export type Props = {
    onChange: (v: 育成タイプ) => void;
    value: 育成タイプ | undefined;
    isLoading?: boolean;
    size?: SelectProps['size'];
    placeholder?: string;
  };
}

const 指定なし = '';
const 日光の強度一覧 = [...Object.values(育成タイプ), 指定なし];
const options = 日光の強度一覧.map(i => ({ value: i, label: !i ? '指定なし' : i }));

export const 育成タイプSelect: React.FC<育成タイプSelect.Props> = props => {
  const { onChange, value, isLoading, size = 'small', placeholder } = props;
  const selectProps: SelectProps = {
    options,
    onChange: e => onChange(e ? e : undefined),
    loading: isLoading,
    value,
    style: { width: '100%' },
    size,
    placeholder,
  };
  return <Select className="育成タイプSelect" {...selectProps} />;
};
