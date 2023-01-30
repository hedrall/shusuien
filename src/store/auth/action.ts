import { useRecoilState } from 'recoil';
import { AUTH_STATE } from '@frontend/store/auth/atom';
import { User, UserId } from '@frontend/domain/model/user';
import { User as AuthUser } from 'firebase/auth';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';

let unsubscribe: null | (() => void) = null;
export const useAuthState = () => {
  const [state, setState] = useRecoilState(AUTH_STATE);

  const isAuthed = !!state.user?.name;

  const setUser = (user?: User) => {
    setState(pre => {
      return {
        ...pre,
        user,
      };
    });
  };

  const authStateChangeSubscriber = async (authUser: AuthUser | null) => {
    console.log('auth status change', { authUser });

    if (!authUser) {
      // detect sign out
      unsubscribe?.();
      setUser(undefined);
      return;
    }

    // detect sign in
    const manager = new FsAppManager.User();
    try {
      const res = FSAppRepository.listenById(manager, authUser.uid as UserId, user => {
        console.log('listen user data');
        setUser(user.value);
      });
      unsubscribe = res.unsubscribe;
    } catch (e: any) {
      console.error(e);
    }
  };

  return {
    user: state.user,
    setUser: setUser,
    isAuthed,
    authStateChangeSubscriber,
  };
};
