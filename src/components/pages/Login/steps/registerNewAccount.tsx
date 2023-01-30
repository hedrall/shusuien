import React, { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Input } from 'antd';
const InputGroup = Input.Group;
import { MyButton } from '@frontend/components/atoms/MyButton';
import { StepProps } from '@frontend/components/pages/Login/steps/common';
import { MyAlert } from '@frontend/components/atoms/MyAlert';
import { AuthError } from 'firebase/auth';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { PasswordInput } from '@frontend/components/atoms/PasswordInput';
import { useAuthState } from '@frontend/store/auth/action';
import { AuthRepository } from '@frontend/domain/repository/auth';

type Inputs = {
  email: string;
  password1: string;
  password2: string;
  result: boolean;
};
export const RegisterNewAccountStep: React.FC<StepProps> = props => {
  const { setStep, email } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthState();
  const { control, getValues, setError, formState } = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email,
      password1: '',
      password2: '',
      result: false,
    },
  });

  const emailCntr = useController({ control, name: 'email' });
  const p1lCntr = useController({
    control,
    name: 'password1',
    rules: { required: true },
  });
  const p2lCntr = useController({
    control,
    name: 'password2',
    rules: { required: true },
  });

  const create = async () => {
    const { password1, password2 } = getValues();

    if (password1 !== password2) {
      setError('result', { message: 'パスワードが一致しません。' });
    }

    setIsLoading(true);
    try {
      // create new account
      const newUser = await AuthRepository.createAccount.withEmail(email, password1);
      setUser(newUser);
      setStep('setUserName', '');
    } catch (e: any) {
      if ('code' in e) {
        console.log(e.code);
        const error = e as AuthError;
        if (error.code === 'auth/weak-password') {
          setError('result', {
            message:
              'パスワードの強度が足りません。もう少し長いパスワードや、英数記号を織り交ぜるなどを試してください。',
          });
        }
      }
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <div className="Step NoAccountStep">
      <div>
        <InputGroup>
          <MyInput controller={emailCntr} readOnly={true} />
        </InputGroup>
      </div>

      <div className="Desc">パスワードを設定してください。</div>

      <div className="PasswordSettingForm">
        <InputGroup>
          <PasswordInput controller={p1lCntr} placeholder="パスワード" autoFocus={true} />
          <PasswordInput controller={p2lCntr} placeholder="確認のためもう一度入力してください。" />
        </InputGroup>
      </div>

      <MyAlert active={!!formState.errors.result?.message} title={formState.errors.result?.message} />

      <MyButton active={formState.isValid && !isLoading} onClick={create} title="登録" isLoading={isLoading} />
    </div>
  );
};
