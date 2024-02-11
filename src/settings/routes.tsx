import React from 'react';
import { ValueOf } from 'type-fest';
import { 旧TopPage } from '@frontend/components/pages/旧Top';
import { ErrorPage } from '@frontend/components/pages/Error';
import { LoginPage } from '@frontend/components/pages/Login';
import { AdminPage } from '@frontend/components/pages/Admin';
import { 植物ごとのデフォルト設定ページ } from '@frontend/components/pages/植物ごとのデフォルト設定ページ';
import { 灌水専用ページ } from '@frontend/components/pages/灌水専用ページ';
import { 棚の設定ページ } from 'src/components/pages/棚の設定';

export const ROUTES = {
  OLD: {
    PATH: '/old',
    NAME: '(旧) トップページ',
    COMPONENT: 旧TopPage,
  },
  LOGIN: {
    PATH: '/login',
    NAME: 'login',
    COMPONENT: LoginPage,
  },
  ERROR: {
    PATH: '/error',
    NAME: 'top',
    COMPONENT: ErrorPage,
  },
  Admin: {
    PATH: '/admin',
    NAME: 'admin',
    COMPONENT: AdminPage,
  },
  植物ごとのデフォルト設定ページ: {
    PATH: '/plantDefaultSettings',
    NAME: '植物ごとのデフォルト設定ページ (PC推奨)',
    COMPONENT: 植物ごとのデフォルト設定ページ,
    ICON: <span>🔧</span>,
  },
  TOP: {
    PATH: '/',
    NAME: '要灌水一覧 (TOP)',
    COMPONENT: 灌水専用ページ,
    ICON: <span>💧</span>,
  },
  棚の設定: {
    PATH: '/tana-settings',
    NAME: '棚の設定',
    COMPONENT: 棚の設定ページ,
    ICON: <span>📦</span>,
  },
} as const satisfies {
  [K: string]: {
    PATH: string;
    NAME: string;
    COMPONENT: React.FC<any>;
    ICON?: React.ReactNode;
  };
};

export type RouteItem = ValueOf<typeof ROUTES>;
export type RoutePath = RouteItem['PATH'];
