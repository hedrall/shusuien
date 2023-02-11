import React from 'react';
import cn from 'classnames';

export namespace MyFormLayout {
  export type Item = {
    label: React.ReactNode;
    input: React.ReactNode;
    type?: 'oneLine';
    align?: 'left' | 'right';
  };
  export type Props = {
    items: Item[];
  };
}

export const MyFormLayout: React.FC<MyFormLayout.Props> = props => {
  const { items } = props;
  return (
    <div className="MyFormLayout">
      {items.map((i, index) => {
        const { label, input, type, align = 'left' } = i;
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
      })}
    </div>
  );
};
