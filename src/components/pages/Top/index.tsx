import React, { useRef } from 'react';
import { 棚を作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';

export type TopPageProps = {};

export const TopPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();

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
      topPage
      <pre>{JSON.stringify(user)}</pre>
      <div>
        <div className="棚を作成" onClick={棚の作成モーダルを開く} role="button">
          ⨁ 棚を作成する
        </div>
      </div>
      <棚を作成モーダル ref={棚を作成モーダルのRef} />
    </div>
  );
};
