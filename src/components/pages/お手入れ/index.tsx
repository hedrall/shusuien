import React from 'react';
import './index.scss';
import { useAuthState } from '@frontend/store/auth/action';
import { 鉢一覧View } from 'src/components/molecules/鉢一覧';
import { フィルタ条件の入力 } from '@frontend/components/molecules/FilterInput';
import { FloatMenu } from '@frontend/components/molecules/FloatMenu';
import { IService, Service as S } from 'src/service';

const Service: IService = S;

export namespace お手入れページ {
  export type Props = {};
}
export const お手入れページ: React.FC<お手入れページ.Props> = () => {
  // --- hooks ---
  const { user } = useAuthState();
  const 鉢一覧 = Service.お手入れページ.use鉢一覧();
  console.log({ 鉢一覧 });

  return (
    <div className="灌水専用ページ">
      <h3 className="SectionTitle">絞り込み</h3>
      <div className="Section">
        <フィルタ条件の入力 />
      </div>

      <鉢一覧View userId={user?.id} 鉢一覧={鉢一覧} 棚Id={undefined} />
      <FloatMenu />
    </div>
  );
};
