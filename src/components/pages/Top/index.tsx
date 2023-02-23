import React, { useRef } from 'react';
import { 棚作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';
import { use棚一覧 } from '@frontend/store/data/action';
import { 棚一覧表示 } from '@frontend/components/organisms/TanaList';
import { Divider } from 'antd';
import { FloatMenu } from '@frontend/components/molecules/FloatMenu';
import { MyLink } from '@frontend/components/atoms/MyLink';

export type TopPageProps = {};

export const TopPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();
  const { 棚一覧 } = use棚一覧.一覧を利用();
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
      <FloatMenu />
      <div className="Section">
        <棚一覧表示 棚一覧={棚一覧} />
      </div>
      <div className="Section">
        <MyButton title={'⨁ 棚を作成する'} onClick={棚作成モーダルを開く} />
      </div>

      <棚作成モーダル ref={棚作成モーダルのRef} />

      <Divider />
      <div className="導線">
        <h2>その他の機能</h2>
        <MyLink
          path={ROUTES.植物ごとのデフォルト設定ページ.PATH}
          navigator={navigator}
          text="植物ごとのデフォルト設定"
        />
      </div>
    </div>
  );
};
