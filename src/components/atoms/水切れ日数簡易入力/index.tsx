import React from 'react';
import './index.scss';
import { 植物ごとのデフォルト設定サービス } from '@frontend/domain/service/plantDefaultSetting';
import { 鉢 } from 'src/domain/entity/鉢';
import { CaretDownOutlined, CaretUpOutlined, UpOutlined } from '@ant-design/icons';
import { 水切れのデフォルト日数 } from '@frontend/supports/settings';
export type 水切れ日数簡易入力Props = {
  鉢: 鉢;
  鉢のデフォルト設定: 植物ごとのデフォルト設定サービス.鉢のデフォルト設定;
  onChange: (value: number) => void;
};

const DEFAULT = 水切れのデフォルト日数;

export const 水切れ日数簡易入力: React.FC<水切れ日数簡易入力Props> = props => {
  const { 鉢, 鉢のデフォルト設定, onChange } = props;
  const 水切れ日数のデフォルト = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(
    鉢のデフォルト設定,
    鉢,
    '水切れ日数',
  );
  const value = 鉢?.詳細.水切れ日数 || 水切れ日数のデフォルト.value || DEFAULT;

  const { 一致Type } = 水切れ日数のデフォルト;
  const 一致Type表示 = (): string => {
    if (一致Type === '鉢の直を利用') return '鉢';
    if (一致Type === '一致せず') return 'デフォルト';
    return 一致Type;
  };

  const onChangeHandler = (type: 'up' | 'down') => {
    if (type === 'up') {
      onChange(value + 1);
      return;
    }
    onChange(value - 1);
  };

  return (
    <div className="水切れ日数簡易入力">
      <div className="コントロール">
        <CaretUpOutlined className="上矢印" onClick={() => onChangeHandler('up')} role="button" tabIndex={0} />
        <div className="数値部分">
          <span className="メインの数値">{value}日</span>
          <span className="一致タイプ">{一致Type表示()}</span>
        </div>
        <CaretDownOutlined className="下矢印" onClick={() => onChangeHandler('down')} role="button" tabIndex={0} />
      </div>
    </div>
  );
};
