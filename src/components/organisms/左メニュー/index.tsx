import React, { useState } from 'react';
import './index.scss';
import { Drawer, DrawerProps, List } from 'antd';
import Ripples from 'react-ripples';
import { SYMBOL_ICONS } from '@frontend/supports/icons';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';

type Item = { title: string; link: string; icon: React.ReactNode };
const メニュー: Item[] = [
  // { title: ROUTES.植物ごとのデフォルト設定ページ.NAME, link: ROUTES.植物ごとのデフォルト設定ページ.PATH },
  { title: ROUTES.灌水専用ページ.NAME, link: ROUTES.灌水専用ページ.PATH, icon: ROUTES.灌水専用ページ.ICON },
  {
    title: ROUTES.植物ごとのデフォルト設定ページ.NAME,
    link: ROUTES.植物ごとのデフォルト設定ページ.PATH,
    icon: ROUTES.植物ごとのデフォルト設定ページ.ICON,
  },
  {
    title: ROUTES.TOP.NAME,
    link: ROUTES.TOP.PATH,
    icon: '',
  },
];
type ListProps = { navigate: NavigateFunction; 閉じる: () => void };
const renderList = ({ navigate, 閉じる }: ListProps) => {
  const onClickLink = (i: Item) => {
    setTimeout(() => {
      閉じる();
      navigate(i.link);
    }, 100);
  };
  return (
    <List
      dataSource={メニュー}
      itemLayout="horizontal"
      renderItem={i => {
        return (
          <Ripples>
            <List.Item
              onClick={() => onClickLink(i)}
              style={{ display: 'flex', gap: 4, justifyContent: 'flex-start', width: '100%' }}
            >
              {i.icon}
              {i.title}
            </List.Item>
          </Ripples>
        );
      }}
    />
  );
};

export namespace 左メニュー {
  export type Props = {};
}
export const 左メニュー: React.FC<左メニュー.Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const 閉じる = () => setIsOpen(false);
  const drawerProps: DrawerProps = {
    className: '左メニュー',
    title: 'メニュー',
    open: isOpen,
    placement: 'left',
    closable: true,
    onClose: 閉じる,
    bodyStyle: {
      padding: 0,
    },
  };

  const 開く = () => setIsOpen(true);

  return (
    <>
      {/* 開くボタン */}
      <div onClick={開く}>
        <SYMBOL_ICONS.左メニュー />
      </div>
      <Drawer {...drawerProps}>{renderList({ navigate, 閉じる })}</Drawer>
    </>
  );
};
