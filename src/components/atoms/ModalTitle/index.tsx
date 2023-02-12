import React from 'react';
import { ICONS } from '@frontend/supports/icons';

export type ModalTitleProps = {
  type: '灌水' | '植替え';
};

const 灌水 = () => {
  return (
    <h1 className="モーダルの見出し">
      <ICONS.灌水 /> 灌水を記録
    </h1>
  );
};
const 植替え = () => {
  return (
    <h1 className="モーダルの見出し">
      <ICONS.植替え />
      植替えを記録
    </h1>
  );
};
export const モーダルの見出し: React.FC<ModalTitleProps> = props => {
  const { type } = props;
  switch (type) {
    case '灌水':
      return 灌水();
    case '植替え':
      return 植替え();
  }
};
