import React, { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Input } from 'antd';
const InputGroup = Input.Group;
import { MyButton } from '@frontend/components/atoms/MyButton';
import { StepProps } from '@frontend/components/pages/Login/steps/common';
import { MyAlert } from '@frontend/components/atoms/MyAlert';
import { useNavigate } from 'react-router-dom';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useAuthState } from '@frontend/store/auth/action';
import { UserId } from '@frontend/domain/model/user';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { ROUTES } from '@frontend/settings/routes';

type Inputs = {
  userName: string;
  result: boolean;
};

export const SetUserNameStep: React.FC<StepProps> = props => {
  const { setStep } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthState();
  const navigate = useNavigate();

  const { control, getValues, setError, formState } = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      userName: '',
      result: false,
    },
  });

  const controller = useController({
    control,
    name: 'userName',
    rules: { required: '必須です。', maxLength: 10 },
  });

  const setUserName = async () => {
    if (!formState.isValid) return;
    const uid = AuthRepository.get.user()?.uid;

    if (!uid) {
      console.log('no user');
      return;
    }

    const { userName } = getValues();
    setIsLoading(true);

    try {
      const manager = new FsAppManager.User();
      await FSAppRepository.update(manager, uid, {
        name: userName,
      });
      const user = await FSAppRepository.getItem(manager, uid as UserId);
      setUser(user.value);
      navigate(ROUTES.TOP.PATH);
    } catch (e: any) {
      setError('result', {
        message: '何らかのエラーが発生しました。恐れ入りますが、しばらく時間が経ってから再度操作してください。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Step NoAccountStep">
      <div className="Desc">登録が完了しました！</div>

      <div className="Desc">
        <CheckCircleOutlined className="Icon" color="#929292" />
        ユーザ名を指定してください。
      </div>

      <div>
        <InputGroup>
          <MyInput controller={controller} placeholder="ユーザ名" autoFocus={true} />
        </InputGroup>
      </div>

      <MyAlert active={!!formState.errors.result?.message} title={formState.errors.result?.message} />
      <MyAlert active={formState.errors.userName?.type === 'maxLength'} title={'10文字までで入力してください。'} />

      <MyButton onClick={setUserName} title="登録" active={!isLoading && formState.isValid} isLoading={isLoading} />
    </div>
  );
};
