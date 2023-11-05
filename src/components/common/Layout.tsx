import React, { useEffect, useRef } from 'react';
import './layout.scss';
import { useAuthState } from '@frontend/store/auth/action';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { use棚の並び順, use棚一覧 } from '@frontend/store/data/action';
import { useEventSubscriber } from '@frontend/hooks/eventSubscriber';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { 左メニュー } from '@frontend/components/organisms/左メニュー';
import { ユーザ名設定モーダル } from 'src/components/organisms/ユーザ名設定モーダル';
import { ICONS, SYMBOL_ICONS } from 'src/supports/icons';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthState();

  const ユーザ名設定モーダルRef = useRef<ユーザ名設定モーダル.Ref>(null);

  useEffect(() => {
    // ユーザ名が未設定の場合にモーダルを見せる
    if (!user) return;
    if (user.名前が未設定()) {
      ユーザ名設定モーダルRef.current?.open(user);
    }
  }, [user]);

  const navigate = useNavigate();
  const location = useLocation();
  const signOut = AuthRepository.signOut;

  const userId = user?.id;
  use棚一覧.購読(userId);
  use棚の並び順.購読(userId);
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
        <div className="Left">
          <左メニュー />
          趣水園
        </div>
        <div className="Right">
          {user && (
            <span onClick={() => ユーザ名設定モーダルRef.current?.open(user)}>
              <SYMBOL_ICONS.User /> {user.name}
            </span>
          )}
          {user && <LogoutOutlined onClick={signOut} />}
        </div>
      </div>

      <div className="Main">{children}</div>

      <div className="Footer">Created by Hedrall</div>

      <canvas id="canvas" style={{ display: 'none' }} />

      <ユーザ名設定モーダル ref={ユーザ名設定モーダルRef} />
    </div>
  );
};
