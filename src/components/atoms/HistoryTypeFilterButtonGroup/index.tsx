import React from 'react';
import './index.scss';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { 履歴の内容 } from 'src/domain/entity/履歴';
import { ICONS } from '@frontend/supports/icons';
import cn from 'classnames';

function toggleArrayItem<T>(arr: T[], item: T, getValue = (item: T) => item) {
  const index = arr.findIndex(i => getValue(i) === getValue(item));
  if (index === -1) return [...arr, item];
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export namespace 履歴のタイプでの絞り込みフィルターグループ {
  export type Props = { field: ControllerRenderProps<any, any> };
}
type P = 履歴のタイプでの絞り込みフィルターグループ.Props;
export const 履歴のタイプでの絞り込みフィルターグループ: React.FC<P> = props => {
  const { field } = props;
  const value = field.value as 履歴の内容.Type[];
  const toggle = (type: 履歴の内容.Type) => {
    const newValue = toggleArrayItem(value, type);
    console.log({
      value,
      type,
      newValue,
    });
    field.onChange(newValue);
  };

  return (
    <div className="履歴のタイプでの絞り込みフィルターグループ">
      {履歴の内容.Type.map(type => {
        const ICON = ICONS[type];
        return (
          <div key={type} className={cn('ボタン', { Active: value.includes(type) })} onClick={() => toggle(type)}>
            <ICON />
          </div>
        );
      })}
    </div>
  );
};
