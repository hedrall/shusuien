import React from 'react';
import { 棚 } from '@frontend/domain/model/tana';
import { Collapse, Dropdown, MenuProps, Popconfirm } from 'antd';
import { 鉢一覧 } from '@frontend/components/molecules/ItemList';
import { OPERATION_ICONS } from '@frontend/supports/icons';

const { Panel } = Collapse;

type Props = {
  棚一覧: 棚[];
};

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

export const 棚一覧表示: React.FC<Props> = props => {
  const { 棚一覧 } = props;

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
