import React from 'react';
import { use全ての鉢一覧, use棚一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢一覧View } from '@frontend/components/molecules/ItemList';

export namespace 灌水専用ページ {
  export type Props = {};
}

export const 灌水専用ページ: React.FC<灌水専用ページ.Props> = props => {
  const { user } = useAuthState();
  const { 棚一覧 } = use棚一覧.一覧を利用();
  const { 鉢一覧 } = use全ての鉢一覧(user);

  return (
    <div className="灌水専用ページ">
      棚: {棚一覧.length}
      鉢: {鉢一覧.length}
      <h2>灌水ページ</h2>
      <鉢一覧View userId={user?.id} 鉢一覧={鉢一覧} 棚Id={undefined} />
    </div>
  );
};
