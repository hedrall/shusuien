import React, { useState } from 'react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { Master } from '@frontend/components/atoms/InputClass/master';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

export namespace 科属種の入力 {
  export type Props = {
    レベル: Master.レベル;
    field: ControllerRenderProps;
  };
}

export const 科属種の入力: React.FC<科属種の入力.Props> = props => {
  const { レベル, field } = props;
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const onSearch = (入力された文字: string) => {
    setOptions(
      Master.get(レベル)
        .filter(i => i.includes(入力された文字))
        .map(value => ({ value, label: value })),
    );
  };

  const onChange = (data: string) => {
    field.onChange(data as string);
  };

  const inputProps: AutoCompleteProps = {
    options,
    value: field.value,
    onSearch,
    onChange,
    style: { width: '100%' },
  };
  return <AutoComplete {...inputProps} />;
};
