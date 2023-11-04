import React from 'react';
import './index.scss';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';

export type ModalTitleProps = {
  type: 履歴.Type | '機能' | '植物ごとのデフォルト設定' | 'デフォルト設定から選択';
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
const 成長記録 = () => {
  return (
    <h1 className="モーダルの見出し">
      <ICONS.成長の記録 />
      成長を記録
    </h1>
  );
};
const 植替待設定 = () => {
  return (
    <h1 className="モーダルの見出し">
      <ICONS.植替待設定 />
      植替待設定
    </h1>
  );
};
const 機能 = () => {
  return (
    <h1 className="機能設定">
      <OPERATION_ICONS.設定 />
      成長を記録
    </h1>
  );
};
const デフォルト設定から選択 = () => {
  return (
    <h1 className="デフォルト設定から選択する">
      <OPERATION_ICONS.設定 />
      デフォルト設定から選択
    </h1>
  );
};
const 植物ごとのデフォルト設定 = () => {
  return <h1 className="植物ごとのデフォルト設定">植物ごとのデフォルト設定</h1>;
};
export const モーダルの見出し: React.FC<ModalTitleProps> = props => {
  const { type } = props;
  switch (type) {
    case '機能':
      return 機能();
    case '灌水':
      return 灌水();
    case '植替え':
      return 植替え();
    case '成長の記録':
      return 成長記録();
    case '植替待設定':
      return 植替待設定();
    case '植物ごとのデフォルト設定':
      return 植物ごとのデフォルト設定();
    case 'デフォルト設定から選択':
      return デフォルト設定から選択();
  }
};
