import { atom } from 'recoil';
import { User } from '@frontend/domain/model/user';

type AuthState = {
  user: User | undefined;
};

export const AUTH_STATE = atom<AuthState>({
  key: 'Auth',
  default: { user: undefined },
});
