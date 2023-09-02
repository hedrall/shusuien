import { FloatButton } from 'antd';
import React, { useRef } from 'react';
import './index.scss';
import { OPERATION_ICONS, SYMBOL_ICONS } from '@frontend/supports/icons';
import { useFilter } from '@frontend/store/filter/action';
import { use灌水時の施肥有無設定 } from '@frontend/store/灌水時の施肥有無設定/action';

export type FloatMenuProps = {};

export const FloatMenu: React.FC<FloatMenuProps> = props => {
  const { filter, set: setFilter } = useFilter();

  const 灌水時の施肥有無設定 = use灌水時の施肥有無設定();

  return (
    <>
      {灌水時の施肥有無設定.is ? (
        <div className="FloatMenu 状態表示">
          <p>
            <OPERATION_ICONS.肥料 style={{ marginRight: 4 }} />
            灌水時に施肥を記録
          </p>
        </div>
      ) : null}

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
        <FloatButton
          icon={<OPERATION_ICONS.肥料 />}
          onClick={灌水時の施肥有無設定.toggle}
          type={灌水時の施肥有無設定.is ? 'primary' : 'default'}
        />
      </FloatButton.Group>
    </>
  );
};
