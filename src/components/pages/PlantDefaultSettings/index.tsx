import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';
import { MyLink } from '@frontend/components/atoms/MyLink';
import { 植物ごとのデフォルト設定の新規作成モーダル } from '@frontend/components/organisms/CreatePlantDefaultSettingModal';
import { MyButton } from '@frontend/components/atoms/MyButton';

export namespace 植物ごとのデフォルト設定ページ {
  export type Props = {};
}

export const 植物ごとのデフォルト設定ページ: React.FC<植物ごとのデフォルト設定ページ.Props> = props => {
  const navigator = useNavigate();
  const 新規作成モーダルのRef = useRef<植物ごとのデフォルト設定の新規作成モーダル.Ref | null>(null);

  return (
    <div className="植物ごとのデフォルト設定ページ">
      <MyLink path={ROUTES.TOP.PATH} navigator={navigator} text="TOPへ戻る" />

      <div className="Section">
        <MyButton title={'⨁ 設定を作成する'} onClick={() => 新規作成モーダルのRef.current?.open()} />
      </div>
      <植物ごとのデフォルト設定の新規作成モーダル ref={新規作成モーダルのRef} />
    </div>
  );
};
