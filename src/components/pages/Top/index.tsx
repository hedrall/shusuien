import React, { useRef } from 'react';
import { 棚を作成モーダル } from '@frontend/components/organisms/CreateTanaModal';

export type TopProps = {};

export const Top: React.FC<TopProps> = props => {
  const 棚を作成モーダルのRef = useRef<棚を作成モーダル.Ref | null>(null);

  const 棚の作成モーダルを開く = () => {
    棚を作成モーダルのRef.current?.open();
  };

  return (
    <div className="Top">
      topPage
      <div>
        <div className="棚を作成" onClick={棚の作成モーダルを開く} role="button">
          ⨁ 棚を作成する
        </div>
      </div>
      <棚を作成モーダル ref={棚を作成モーダルのRef} />
    </div>
  );
};
