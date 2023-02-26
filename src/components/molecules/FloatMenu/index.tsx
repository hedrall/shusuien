import { FloatButton } from 'antd';
import React, { useRef } from 'react';
import { ICONS, OPERATION_ICONS, SYMBOL_ICONS } from '@frontend/supports/icons';
import { use一括灌水モード設定 } from '@frontend/store/operation/action';
import { 便利機能モーダル } from '@frontend/components/molecules/UtilityModal';
import { useFilter } from '@frontend/store/filter/action';

export type FloatMenuProps = {};

export const FloatMenu: React.FC<FloatMenuProps> = props => {
  const ref = useRef<便利機能モーダル.Ref | null>(null);
  const { filter, set: setFilter } = useFilter();
  const {
    state: { ON },
    isをトグル,
  } = use一括灌水モード設定();

  return (
    <>
      <FloatButton.Group shape="circle" style={{ right: 84 }}>
        <FloatButton
          icon={<SYMBOL_ICONS.FILTER />}
          onClick={setFilter.toggleEnabled}
          type={filter.enabled ? 'primary' : 'default'}
        />
      </FloatButton.Group>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 24 }}
        className="FloatMenu"
        icon={<OPERATION_ICONS.FLOAT_MENU />}
      >
        <FloatButton icon={<ICONS.灌水 />} onClick={isをトグル} type={ON ? 'primary' : 'default'} />
        <FloatButton icon={<OPERATION_ICONS.設定 />} type="primary" onClick={ref.current?.open} />
      </FloatButton.Group>

      <便利機能モーダル ref={ref} />
    </>
  );
};
