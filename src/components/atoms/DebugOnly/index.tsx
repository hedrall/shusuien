import React, { useEffect, useState } from 'react';
import './index.scss';
import { atom, useRecoilState } from 'recoil';

export type DebugOnlyProps = {
  children: React.ReactNode;
};

const Atom = atom<boolean>({
  key: 'DebugState',
  default: false /* 開発で利用可能 */,
});

export const DebugOnly: React.FC<DebugOnlyProps> = props => {
  const [isDebugMode, setIsDebugMode] = useRecoilState(Atom);

  useEffect(() => {
    // @ts-ignore
    window['DEBUG'] = () => setIsDebugMode(pre => !pre);
    console.warn(`デバッグモードが有効。デバッグモードを起動するには, 'DEBUG()'を実行してください。`);
  }, []);

  console.log({ isDebugMode });
  if (!isDebugMode) return null;
  return <>{props.children}</>;
};
