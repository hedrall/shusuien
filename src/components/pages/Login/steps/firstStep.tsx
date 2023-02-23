import React from 'react';
import { useController, useForm } from 'react-hook-form';
import { AuthError } from 'firebase/auth';
import { Button, Divider, Input } from 'antd';
const InputGroup = Input.Group;
import { MyButton } from '@frontend/components/atoms/MyButton';
import { MyAlert } from '@frontend/components/atoms/MyAlert';
import { StepProps } from '@frontend/components/pages/Login/steps/common';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { useAuthState } from '@frontend/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { User, UserId } from '@frontend/domain/model/user';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { ROUTES } from '@frontend/settings/routes';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';

export const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );

function GoogleLoginButton(props: { onClick: () => Promise<void> }) {
  return (
    <Button onClick={props.onClick}>
      <div className="GoogleSignInButtonContent">
        <img className="GoogleIcon" src="/images/googleIcon.svg" />
        Googleログイン
      </div>
    </Button>
  );
}

export const FirstStep: React.FC<StepProps> = props => {
  const { setStep } = props;
  const { control, getValues, formState, setError } = useForm<{
    email: string;
    result: boolean;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      result: false,
    },
  });
  const { setUser } = useAuthState();
  const navigate = useNavigate();

  const email = useController({
    control,
    name: 'email',
    rules: { required: '必須です。' },
  });

  const signInWithEmail = async () => {
    const { email } = getValues();
    if (!isValidEmail(email)) {
      setError('result', { message: 'emailの形式が不正です。' });
      return;
    }
    try {
      const result = await AuthRepository.get.signInMethodForEmail(email);
      switch (result) {
        case 'no-account':
          setStep('noAccount', email);
          return;
        case 'registered-with-google':
          setError('result', { message: 'Googleアカウントにて登録されています。' });
          return;
        case 'with-email':
        default:
          // can sign in with password
          setStep('inputPassword', email);
      }
    } catch (e: any) {
      const isAuthError = (e: any): e is AuthError => 'name' in e && e.name === 'FirebaseError';

      if (!isAuthError(e)) return;

      const { code } = e as AuthError;

      console.log({ code });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { dbUser, uid } = await AuthRepository.signIn.withGoogle();

      if (dbUser) {
        setUser(dbUser);
        navigate(ROUTES.TOP.PATH);
        return;
      }

      // create new user to firestore
      await FSAppRepository.addItemWithId(new FsAppManager.User(), User.createDefault(uid), uid as UserId);
      setStep('setUserName', '');
    } catch (_error: any) {
      if ('code' in _error) {
        const error = _error as AuthError;
        if (error.code === 'auth/popup-closed-by-user') {
          return;
        }
      }
      throw _error;
    }
  };

  return (
    <div className="Step FirstStep">
      <div className="EmailPasswordSignIn">
        <InputGroup>
          <MyInput type="email" controller={email} placeholder="メールアドレス" autoFocus={true} />
        </InputGroup>
      </div>

      <MyButton onClick={signInWithEmail} active={formState.isValid} title="続行" />

      <MyAlert active={!!formState.errors.result?.message} title={formState.errors.result?.message} />

      <Divider />

      <GoogleLoginButton onClick={signInWithGoogle} />
    </div>
  );
};
