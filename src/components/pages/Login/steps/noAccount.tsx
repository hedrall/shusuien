import React from 'react';
import { useController, useForm } from 'react-hook-form';
import { Input } from 'antd';
const InputGroup = Input.Group;
import { MyButton } from '@frontend/components/atoms/MyButton';
import { StepProps } from '@frontend/components/pages/Login/steps/common';
import { MyInput } from '@frontend/components/atoms/MyInput';

export const NoAccountStep: React.FC<StepProps> = props => {
  const { setStep, email } = props;
  const { control } = useForm<{
    email: string;
    result: boolean;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email,
      result: false,
    },
  });

  const controller = useController({
    control,
    name: 'email',
    rules: { required: '必須です。' },
  });

  const createNewAccount = async () => {
    setStep('registerNewAccount', email);
  };

  return (
    <div className="Step NoAccountStep">
      <div className="EmailPasswordSignIn">
        <InputGroup>
          <MyInput controller={controller} readOnly={true} />
        </InputGroup>
      </div>

      <div className="Desc">
        入力されたメールアドレスは登録されていません。 <br />
        新規のユーザ登録を行いますか？
      </div>

      <MyButton autoFocus={true} onClick={createNewAccount} title="続行" />
    </div>
  );
};
