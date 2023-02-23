import React from 'react';
import { 棚 } from '@frontend/domain/model/tana';
import { Collapse, Dropdown, MenuProps, Popconfirm } from 'antd';
import { 鉢一覧 } from '@frontend/components/molecules/ItemList';
import { OPERATION_ICONS, SYMBOL_ICONS } from '@frontend/supports/icons';
import { ValueOf } from 'type-fest';
import { テーブル表示 } from '@frontend/components/organisms/TableView';

const { Panel } = Collapse;

export const 表示モード = {
  グリッド: { KEY: 'グリッド', ICON: SYMBOL_ICONS.グリッド },
  テーブル: { KEY: 'テーブル', ICON: SYMBOL_ICONS.テーブル },
} as const;
export type 表示モード = ValueOf<typeof 表示モード>['KEY'];

export namespace 棚一覧表示 {
  export type Props = {
    棚一覧: 棚[];
    表示モード: 表示モード;
  };
}

const getItems = (p: { onDelete: () => Promise<void> }): MenuProps['items'] => [
  {
    label: (
      <Popconfirm title="本当に削除してもよろしいですか？" onConfirm={p.onDelete} okText="削除" cancelText="キャンセル">
        <span onClick={e => e.stopPropagation()}>
          <OPERATION_ICONS.DELETE style={{ marginRight: 4 }} />
          削除
        </span>
      </Popconfirm>
    ),
    key: '0',
    onClick: () => {
      /* do nothing */
    },
  },
];

const グリッド表示 = ({ 棚一覧 }: { 棚一覧: 棚[] }) => {
  return (
    <Collapse className="棚一覧表示" defaultActiveKey={undefined}>
      {棚一覧.map((棚, index) => {
        const header = (
          <div className="棚名部分">
            <span>{棚.name}</span>
            <Dropdown trigger={['click']} menu={{ items: getItems({ onDelete: () => 棚.削除() }) }}>
              <div
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <OPERATION_ICONS.MENU />
              </div>
            </Dropdown>
          </div>
        );
        return (
          <Panel key={index} header={header}>
            <鉢一覧 棚={棚} key={index} />
          </Panel>
        );
      })}
    </Collapse>
  );
};
export const 棚一覧表示: React.FC<棚一覧表示.Props> = props => {
  const { 棚一覧, 表示モード } = props;
  const isグリッド表示 = 表示モード === 'グリッド';
  return <div>{isグリッド表示 ? <グリッド表示 棚一覧={棚一覧} /> : <テーブル表示 棚一覧={棚一覧} />}</div>;
};
