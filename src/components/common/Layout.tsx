import React, { useEffect } from 'react';
import { useAuthState } from '@frontend/store/auth/action';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { use棚一覧購読 } from '@frontend/store/data/action';
import { 鉢 } from '@frontend/domain/model/item';
import { notification } from 'antd';
import { Subscription } from 'rxjs';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = AuthRepository.signOut;

  use棚一覧購読(user?.id);

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
  }, [user?.id]);

  // 通知系
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    const unSubs: Subscription[] = [];
    unSubs.push(
      鉢.events.フィールドを更新.subscribe(({ フィールド名, 更新後のValue }) => {
        api.success({
          message: `"${フィールド名}" を更新しました。`,
          description: `${更新後のValue}`,
          placement: 'bottomRight',
        });
      }),
    );
    unSubs.push(
      鉢.events.詳細を更新.subscribe(({ プロパティ名, 更新後のValue }) => {
        api.success({
          message: `"${プロパティ名}" を更新しました。`,
          description: `${更新後のValue}`,
          placement: 'bottomRight',
        });
      }),
    );
    unSubs.push(
      鉢.events.削除.subscribe(({ item }) => {
        api.success({ message: `削除しました。`, placement: 'bottomRight' });
      }),
    );
    unSubs.push(
      鉢.events.管理.subscribe(({ type }) => {
        api.success({ message: `${type}しました。`, placement: 'bottomRight' });
      }),
    );
    return () => {
      unSubs.map(us => us.unsubscribe());
    };
  }, []);

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
