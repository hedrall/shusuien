import React, { useRef } from 'react';
import { use棚一覧, 灌水が必要な鉢一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢一覧View } from '@frontend/components/molecules/ItemList';
import { 鉢 } from 'src/domain/model/鉢';
import { 棚ID } from '@frontend/domain/model/棚';
import { useNavigate } from 'react-router-dom';
import { TOPに戻るリンク } from '@frontend/components/atoms/MyLink';
import { この棚の鉢一覧モーダル } from '@frontend/components/organisms/この棚の鉢一覧モーダル';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';

export namespace 灌水専用ページ {
  export type Props = {};
}

type 棚ごと = { [棚名: string]: 鉢[] };

export const 灌水専用ページ: React.FC<灌水専用ページ.Props> = props => {
  const { user } = useAuthState();
  const navigator = useNavigate();
  const { 棚一覧 } = use棚一覧.一覧を利用();
  const { 要灌水, それ以外 } = 灌水が必要な鉢一覧(user);
  const ref = useRef<この棚の鉢一覧モーダル.Ref>(null);

  const 棚名byId = (id: 棚ID) => {
    return 棚一覧.find(棚 => 棚.id === id)?.name || 'unknown';
  };
  // 棚でgroup化
  const 棚ごと = 要灌水.reduce<棚ごと>((pre, 鉢) => {
    const 棚名 = 棚名byId(鉢.棚Id);
    return { ...pre, [棚名]: [...(pre[棚名] || []), 鉢] };
  }, {});
  return (
    <div className="灌水専用ページ">
      <TOPに戻るリンク navigator={navigator} />
      <h2>要灌水ページ</h2>
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
          const onClickHandler = () => {
            console.log(`on click ${棚名}, ${棚.id}`);
            ref.current?.open(棚.id!);
          };
          return (
            <div key={棚名}>
              <p className="棚名">{棚名}</p>
              <鉢一覧View userId={user?.id} 鉢一覧={鉢一覧} 棚Id={undefined} />
              <div className="この棚の鉢一覧" onClick={onClickHandler}>
                <OPERATION_ICONS.MORE /> この棚の鉢一覧
              </div>
            </div>
          );
        })}
      <hr />
      <p>それ以外</p>
      <鉢一覧View userId={user?.id} 鉢一覧={それ以外} 棚Id={undefined} />
      <この棚の鉢一覧モーダル ref={ref} />
    </div>
  );
};
