import React, { useRef } from 'react';
import { 棚作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';
import { 棚Selector } from '@frontend/store/data/action';
import { 棚一覧表示 } from '@frontend/components/organisms/TanaList';
import { useRecoilState } from 'recoil';
import { ICONS } from '@frontend/supports/icons';
import { Select, SelectProps } from 'antd';
import { 灌水量の選択肢 } from '@frontend/supports/selections';
import { use一括灌水モード設定 } from '@frontend/store/operation/action';

export type TopPageProps = {};

const options = 灌水量の選択肢.map(({ name, value }) => ({ label: name, value }));

export const TopPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();
  const [棚一覧] = useRecoilState(棚Selector);
  const 一括灌水モード = use一括灌水モード設定();

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

  const toggle一括灌水モード = () => {
    一括灌水モード.isをトグル();
  };
  const selectProps: SelectProps = {
    options,
    value: 一括灌水モード.state.灌水量,
    onChange: e => {
      一括灌水モード.灌水量をセット(e);
    },
  };
  return (
    <div className="Top">
      <div className="一括灌水">
        <MyButton
          title={
            <div>
              <ICONS.灌水 /> 一括灌水モード
            </div>
          }
          onClick={toggle一括灌水モード}
          style={{ background: 一括灌水モード.state.ON ? '#0063F8' : '#525252' }}
        />
        {一括灌水モード.state.ON ? <Select {...selectProps} /> : null}
      </div>
      {一括灌水モード.state.ON ? (
        <p className="一括灌水モードの補足">⚠️ 鉢のアイコンを押すと灌水を実行します。</p>
      ) : null}
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
