import { ValueOf } from 'type-fest';
import { TopPage } from '@frontend/components/pages/Top';
import { Error } from '@frontend/components/pages/Error';
import { LoginPage } from '@frontend/components/pages/Login';
import { AdminPage } from '@frontend/components/pages/Admin';
import { 植物ごとのデフォルト設定ページ } from '@frontend/components/pages/PlantDefaultSettings';

export const ROUTES = {
  TOP: {
    PATH: '/',
    NAME: 'top',
    COMPONENT: TopPage,
  },
  LOGIN: {
    PATH: '/login',
    NAME: 'login',
    COMPONENT: LoginPage,
  },
  ERROR: {
    PATH: '/error',
    NAME: 'top',
    COMPONENT: Error,
  },
  Admin: {
    PATH: '/admin',
    NAME: 'admin',
    COMPONENT: AdminPage,
  },
  植物ごとのデフォルト設定ページ: {
    PATH: '/plantDefaultSettings',
    NAME: '植物ごとのデフォルト設定ページ',
    COMPONENT: 植物ごとのデフォルト設定ページ,
  },
} as const;

export type RouteItem = ValueOf<typeof ROUTES>;
export type RoutePath = RouteItem['PATH'];
