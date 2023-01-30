import React, { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Input } from 'antd';
const InputGroup = Input.Group;
import { MyButton } from '@frontend/components/atoms/MyButton';
import { StepProps } from '@frontend/components/pages/Login/steps/common';
import { MyAlert } from '@frontend/components/atoms/MyAlert';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { PasswordInput } from '@frontend/components/atoms/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { ROUTES } from '@frontend/settings/routes';

type Inputs = {
  email: string;
  password: string;
  result: boolean;
};
export const InputPasswordStep: React.FC<StepProps> = props => {
  const { email } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { control, getValues, setError, formState } = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email,
      password: '',
      result: false,
    },
  });

  const emailCntr = useController({ control, name: 'email' });
  const passwordCntr = useController({
    control,
    name: 'password',
    rules: { required: true },
  });

  const login = async () => {
    if (!formState.isValid) return;
    const { password } = getValues();
    setIsLoading(true);
    try {
      // sign in
      await AuthRepository.signIn.withEmail(email, password);
      navigate(ROUTES.TOP.PATH);
    } catch (e: any) {
      if ('code' in e) {
        console.log(e.code);
        if (e.code === 'auth/wrong-password') {
          setError('result', {
            message: 'ログインに失敗しました。メールアドレス、またはパスワードを確認してください。',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Step InputPasswordStep">
      <div className="Form">
        <InputGroup>
          <MyInput controller={emailCntr} readOnly={true} />
          <PasswordInput controller={passwordCntr} autoFocus={true} />
        </InputGroup>
      </div>

      <MyAlert active={!!formState.errors.result?.message} title={formState.errors.result?.message} />

      <MyButton active={formState.isValid && !isLoading} onClick={login} title="ログイン" isLoading={isLoading} />
    </div>
  );
};
