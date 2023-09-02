import React, { useRef } from 'react';
import './index.scss';
import { use棚一覧, 灌水が必要な鉢一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢一覧View } from '@frontend/components/molecules/ItemList';
import { 鉢 } from '@frontend/domain/model/鉢';
import { 棚, 棚ID } from '@frontend/domain/model/棚';
import { useNavigate } from 'react-router-dom';
import { TOPに戻るリンク } from '@frontend/components/atoms/MyLink';
import { この棚の鉢一覧モーダル } from '@frontend/components/organisms/この棚の鉢一覧モーダル';
import { OPERATION_ICONS } from '@frontend/supports/icons';
import { 一括灌水モーダル } from '@frontend/components/organisms/一括灌水Modal';
import { Button } from 'antd';
import { フィルタ条件の入力 } from '@frontend/components/molecules/FilterInput';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 棚作成モーダル } from '@frontend/components/organisms/CreateTanaModal';

const 棚名by鉢Id = (id: 棚ID, 棚一覧: 棚[]) => {
  return 棚一覧.find(棚 => 棚.id === id)?.name || 'unknown';
};

type T棚ごと = { [棚名: string]: 鉢[] };
namespace T棚ごと {
  export const Default = (棚一覧: 棚[]): T棚ごと => {
    return 棚一覧.reduce<T棚ごと>((pre, 棚) => {
      return {
        ...pre,
        [棚.name]: [],
      };
    }, {});
  };
}

export namespace 灌水専用ページ {
  export type Props = {};
}
export const 灌水専用ページ: React.FC<灌水専用ページ.Props> = () => {
  // --- hooks ---
  const navigator = useNavigate();
  const { user } = useAuthState();
  const { 棚一覧 } = use棚一覧.一覧を利用();
  const { 要灌水 } = 灌水が必要な鉢一覧(user);

  // --- refs ---
  const この棚の鉢一覧モーダルref = useRef<この棚の鉢一覧モーダル.Ref>(null);
  const 一括灌水モーダルref = useRef<一括灌水モーダル.Ref>(null);
  const 棚作成モーダルのRef = useRef<棚作成モーダル.Ref>(null);

  // 棚でgroup化
  const 棚ごと = 要灌水.reduce<T棚ごと>((pre, 鉢) => {
    const 棚名 = 棚名by鉢Id(鉢.棚Id, 棚一覧);
    return { ...pre, [棚名]: [...(pre[棚名] || []), 鉢] };
  }, T棚ごと.Default(棚一覧));

  // --- modal操作 ---
  const 棚作成モーダルを開く = () => {
    棚作成モーダルのRef.current?.open();
  };
  const この棚の鉢一覧モーダルを開く = (棚Id: 棚ID) => {
    この棚の鉢一覧モーダルref.current?.open(棚Id);
  };
  const 一括灌水モーダルを開く = (棚: 棚, 鉢一覧: 鉢[]) => {
    一括灌水モーダルref.current?.open({ 棚, 鉢一覧 });
  };

  return (
    <div className="灌水専用ページ">
      <TOPに戻るリンク navigator={navigator} />
      <h2>要灌水ページ</h2>
      <h3 className="SectionTitle">絞り込み</h3>
      <div className="Section">
        <フィルタ条件の入力 />
      </div>
      {Object.entries(棚ごと)
        .filter(([棚名]) => 棚名 !== 'unknown')
        .sort((pre, cur) => {
          // 棚と同じ順番に並び替え
          const pre棚Index = 棚一覧.findIndex(棚 => 棚.name === pre[0]);
          const cur棚Index = 棚一覧.findIndex(棚 => 棚.name === cur[0]);
          return pre棚Index > cur棚Index ? 1 : -1;
        })
        .map(([棚名, 鉢一覧]) => {
          const 棚 = 棚一覧.find(i => i.name === 棚名)!;
          return (
            <div key={棚名}>
              <div className="棚名">
                <span>{棚名}</span>
                {鉢一覧.length ? (
                  <Button size="small" className="一括灌水ボタン" onClick={() => 一括灌水モーダルを開く(棚, 鉢一覧)}>
                    一括灌水
                  </Button>
                ) : null}
              </div>
              <鉢一覧View userId={user?.id} 鉢一覧={鉢一覧} 棚Id={undefined} />
              <div className="この棚の鉢一覧" onClick={() => この棚の鉢一覧モーダルを開く(棚.id!)}>
                <OPERATION_ICONS.MORE /> この棚の鉢一覧
              </div>
            </div>
          );
        })}

      <div className="Section">
        <MyButton title={'⨁ 棚を作成する'} onClick={棚作成モーダルを開く} />
      </div>

      {/* modals */}
      <この棚の鉢一覧モーダル ref={この棚の鉢一覧モーダルref} />
      <一括灌水モーダル ref={一括灌水モーダルref} />
      <棚作成モーダル ref={棚作成モーダルのRef} />
    </div>
  );
};
