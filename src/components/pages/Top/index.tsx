import React, { useEffect, useRef, useState } from 'react';
import { 棚を作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { useDataState } from '@frontend/store/data/action';

export type TopPageProps = {};

export const TopPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();

  const { 棚を購読, 棚一覧 } = useDataState();

  useEffect(() => {
    if (!user?.id) return;
    const { unsubscribe } = 棚を購読(user.id);
    return () => unsubscribe();
  }, [user?.id]);

  const navigator = useNavigate();

  const 棚を作成モーダルのRef = useRef<棚を作成モーダル.Ref | null>(null);

  const 棚の作成モーダルを開く = () => {
    棚を作成モーダルのRef.current?.open();
  };

  if (!user) {
    return (
      <div className="Top">
        <MyButton title={'ログインページへ'} onClick={() => navigator(ROUTES.LOGIN.PATH)} />
      </div>
    );
  }
  return (
    <div className="Top">
      <h2>topPage </h2>
      <pre>{JSON.stringify(棚一覧, null, 2)}</pre>
      <div>
        <MyButton title={'⨁ 棚を作成する'} onClick={棚の作成モーダルを開く} />
      </div>
      <棚を作成モーダル ref={棚を作成モーダルのRef} />
    </div>
  );
};
