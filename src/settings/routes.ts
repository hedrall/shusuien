import { ValueOf } from 'type-fest';
import { TopPage } from '@frontend/components/pages/Top';
import { Error } from '@frontend/components/pages/Error';
import { LoginPage } from '@frontend/components/pages/Login';

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
} as const;

export type RouteItem = ValueOf<typeof ROUTES>;
export type RoutePath = RouteItem['PATH'];
