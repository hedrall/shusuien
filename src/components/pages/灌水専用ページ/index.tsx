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

export namespace 灌水専用ページ {
  export type Props = {};
}

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

export const 灌水専用ページ: React.FC<灌水専用ページ.Props> = props => {
  const { user } = useAuthState();
  const navigator = useNavigate();
  const { 棚一覧 } = use棚一覧.一覧を利用();
  const { 要灌水, それ以外 } = 灌水が必要な鉢一覧(user);
  const ref = useRef<この棚の鉢一覧モーダル.Ref>(null);

  // 棚でgroup化
  const 棚ごと = 要灌水.reduce<T棚ごと>((pre, 鉢) => {
    const 棚名 = 棚名by鉢Id(鉢.棚Id, 棚一覧);
    return { ...pre, [棚名]: [...(pre[棚名] || []), 鉢] };
  }, T棚ごと.Default(棚一覧));

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
