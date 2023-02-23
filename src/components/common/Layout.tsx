import React, { useEffect } from 'react';
import { useAuthState } from '@frontend/store/auth/action';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { use棚一覧 } from '@frontend/store/data/action';
import { useEventSubscriber } from '@frontend/hooks/eventSubscriber';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = AuthRepository.signOut;

  const userId = user?.id;
  use棚一覧.購読(userId);
  use植物ごとのデフォルト設定.購読を開始(userId);

  useEffect(() => {
    if (location.pathname === ROUTES.LOGIN.PATH && user) {
      const params = new URLSearchParams(location.search);
      const from = params.get('from');
      const to = from ? decodeURIComponent(from) : ROUTES.TOP.PATH;
      console.log('ログイン済みのため、元のURLへ返します');
      console.log({ user });
      navigate(to);
      return;
    }
    if (location.pathname !== ROUTES.LOGIN.PATH && !user) {
      console.log('未ログイン状態のため、LOGINへ遷移します');
      const from = encodeURIComponent(location.pathname + location.search);
      navigate(ROUTES.LOGIN.PATH + `?from=${from}`);
    }
  }, [userId]);

  // 通知系
  const { contextHolder } = useEventSubscriber();

  return (
    <div className="Layout">
      {contextHolder}
      <div className="Header">
        趣水園
        {user && <LogoutOutlined onClick={signOut} />}
      </div>
      <div className="Main">{children}</div>
      <div className="Footer">Created by Hedrall</div>
    </div>
  );
};
