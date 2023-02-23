import React from 'react';
import cn from 'classnames';

export namespace MyFormLayout {
  export type Item = {
    label: React.ReactNode;
    input: React.ReactNode;
    type?: 'oneLine';
    align?: 'left' | 'right';
  };
  export type GroupItem = {
    label: string;
    items: (Item | GroupItem)[];
  };
  export type Props = {
    items: (Item | GroupItem)[];
  };
}

const renderItem = (item: MyFormLayout.Item, index: number | string) => {
  const { label, input, type, align = 'left' } = item;
  const baseClasses = ['Item', { Right: align === 'right' }];
  const labelElem = typeof label === 'string' ? <label>{label}</label> : label;
  if (type === 'oneLine') {
    return (
      <div className={cn(...baseClasses, 'OneLine')} key={index}>
        {labelElem}
        {input}
      </div>
    );
  }
  return (
    <div className={cn(...baseClasses)} key={index}>
      {labelElem}
      {input}
    </div>
  );
};

const renderGroup = (group: MyFormLayout.GroupItem, index: number | string) => {
  const { label, items } = group;
  const labelElem = typeof label === 'string' ? <label className="GroupLabel">{label}</label> : label;
  return (
    <div className="Group" key={index}>
      {labelElem}
      <div className="GroupItems">
        {items.map((i, _index) => {
          return 'items' in i ? renderGroup(i, `${index}_${_index}`) : renderItem(i, `${index}_${_index}`);
        })}
      </div>
    </div>
  );
};
export const MyFormLayout: React.FC<MyFormLayout.Props> = props => {
  const { items } = props;
  return (
    <div className="MyFormLayout">
      {items.map((i, index) => {
        return 'items' in i ? renderGroup(i, index) : renderItem(i, index);
      })}
    </div>
  );
};
