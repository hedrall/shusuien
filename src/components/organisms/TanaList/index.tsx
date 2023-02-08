import React, { useRef } from 'react';
import { 棚 } from '@frontend/domain/model/tana';
import { Collapse, List } from 'antd';
import { 鉢一覧 } from '@frontend/components/molecules/ItemList';

const { Panel } = Collapse;

type Props = {
  棚一覧: 棚[];
};

export const 棚一覧表示: React.FC<Props> = props => {
  const { 棚一覧 } = props;

  return (
    <Collapse className="TanaList" defaultActiveKey={undefined}>
      {棚一覧.map((棚, index) => (
        <Panel key={index} header={棚.name}>
          <鉢一覧 棚={棚} index={index} key={index} />
        </Panel>
      ))}
    </Collapse>
  );
};
