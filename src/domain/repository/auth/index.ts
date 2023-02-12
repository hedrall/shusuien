import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as _signOut,
  onAuthStateChanged,
  User as AuthUser,
} from 'firebase/auth';
import { User, UserId } from '@frontend/domain/model/user';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

const auth = getAuth();
auth.languageCode = 'ja';

const googleProvider = new GoogleAuthProvider();

export namespace AuthRepository {
  export namespace get {
    export const user = () => auth.currentUser;

    type SignInMethod = 'no-account' | 'registered-with-google' | 'with-email';
    export const signInMethodForEmail = async (email: string): Promise<SignInMethod> => {
      const result = await fetchSignInMethodsForEmail(auth, email);
      if (result.length === 0) return 'no-account';
      if (result.includes('google.com')) return 'registered-with-google';
      return 'with-email';
    };
  }

  export namespace signIn {
    export const withGoogle = async (): Promise<{
      dbUser: User | undefined;
      uid: string;
    }> => {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;

      const manager = new FsAppManager.User();
      const user = await FSAppRepository.getItem(manager, uid as UserId);
      if (user.value) {
        return { dbUser: user.value, uid };
      }
      return { uid, dbUser: undefined };
    };

    export const withEmail = async (email: string, password: string) => {
      const result = await signInWithEmailAndPassword(auth, email, password);
    };
  }

  export const signOut = async () => {
    await _signOut(auth);
  };

  export namespace createAccount {
    export const withEmail = async (email: string, password: string) => {
      // create new account
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // create new user to firestore
      const manager = new FsAppManager.User();
      const newUser = User.createDefault(result.user.uid);
      await FSAppRepository.addItemWithId(manager, newUser, newUser.id);

      return newUser;
    };
  }

  export namespace listen {
    export const authStateChanged = (callback: (user: AuthUser | null) => void) => {
      onAuthStateChanged(auth, callback);
    };
  }
}
