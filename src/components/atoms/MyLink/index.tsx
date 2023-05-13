import React, { MouseEventHandler, ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';

export type MyLinkProps = {
  path: string;
  navigator: NavigateFunction;
  text: ReactNode;
};

export const MyLink: React.FC<MyLinkProps> = props => {
  const { navigator, path, text } = props;

  const navigate: MouseEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    navigator(path);
  };

  return (
    <span className="MyLink" onClick={navigate}>
      {text}
    </span>
  );
};

export const TOPに戻るリンク = (props: { navigator: any }) => (
  <MyLink path={ROUTES.TOP.PATH} navigator={props.navigator} text="TOPへ戻る" />
);
