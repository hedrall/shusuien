import React, { useEffect, useRef } from 'react';
import { 棚作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';
import { useDataState } from '@frontend/store/data/action';
import { 棚一覧表示 } from '@frontend/components/organisms/TanaList';

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

  const 棚作成モーダルのRef = useRef<棚作成モーダル.Ref | null>(null);

  const 棚作成モーダルを開く = () => {
    棚作成モーダルのRef.current?.open();
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
      <div className="Section">
        <棚一覧表示 棚一覧={棚一覧} />
      </div>
      <div className="Section">
        <MyButton title={'⨁ 棚を作成する'} onClick={棚作成モーダルを開く} />
      </div>

      <棚作成モーダル ref={棚作成モーダルのRef} />
    </div>
  );
};
