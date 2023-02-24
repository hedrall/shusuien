import React, { useRef } from 'react';
import { 棚作成モーダル } from '@frontend/components/organisms/CreateTanaModal';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ROUTES } from '@frontend/settings/routes';
import { use棚一覧 } from '@frontend/store/data/action';
import { 棚一覧表示, 表示モード } from '@frontend/components/organisms/TanaList';
import { Divider } from 'antd';
import { FloatMenu } from '@frontend/components/molecules/FloatMenu';
import { MyLink } from '@frontend/components/atoms/MyLink';
import { RadioGroup } from '@frontend/components/atoms/RadioGroup';
import { useController, useForm } from 'react-hook-form';
import { SYMBOL_ICONS } from '@frontend/supports/icons';
import { フィルタ条件の入力 } from '@frontend/components/molecules/FilterInput';

export type TopPageProps = {};

type Input = {
  表示モード: 表示モード;
};
const 表示モードのOption = Object.values(表示モード).map(i => {
  const key = i.KEY;
  const Icon = SYMBOL_ICONS[key];
  return {
    name: (
      <span>
        <Icon style={{ marginRight: 4 }} />
        {key}
      </span>
    ),
    value: key,
  };
});
export const TopPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();
  const { 棚一覧 } = use棚一覧.一覧を利用();
  const navigator = useNavigate();
  const { control } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { 表示モード: 表示モード.グリッド.KEY },
  });
  const C表示モード = useController({
    control,
    name: '表示モード',
  });

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
      <h2 className="SectionTitle">表示形式</h2>
      <div className="Section コントロール">
        <RadioGroup field={C表示モード.field} options={表示モードのOption} size="small" />
      </div>

      <h2 className="SectionTitle">絞り込み</h2>
      <div className="Section">
        <フィルタ条件の入力 />
      </div>

      <h2 className="SectionTitle">棚一覧</h2>
      <div className="Section">
        <棚一覧表示 棚一覧={棚一覧} 表示モード={C表示モード.field.value} />
      </div>

      <div className="Section">
        <MyButton title={'⨁ 棚を作成する'} onClick={棚作成モーダルを開く} />
      </div>

      <Divider />
      <div className="導線">
        <h2>その他の機能</h2>
        <MyLink
          path={ROUTES.植物ごとのデフォルト設定ページ.PATH}
          navigator={navigator}
          text="植物ごとのデフォルト設定"
        />
      </div>

      <FloatMenu />
      <棚作成モーダル ref={棚作成モーダルのRef} />
    </div>
  );
};
