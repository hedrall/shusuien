import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ModalProps } from 'antd';
import { useController, useForm } from 'react-hook-form';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { useAuthState } from '@frontend/store/auth/action';
import { useWithLoading } from '@frontend/supports/ui';
import { 鉢 } from '@frontend/domain/model/item';

export namespace 鉢作成モーダル {
  export type Props = {};
  export type Ref = {
    open: () => void;
  };
}

type InputType = {
  name: string;
};

export const 鉢作成モーダル = forwardRef<鉢作成モーダル.Ref, 鉢作成モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const { user } = useAuthState();
  const { control, getValues } = useForm<InputType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const name = useController({
    control,
    name: 'name',
    rules: { required: '必須です。' },
  });

  const isValid = !!getValues().name;

  const modalProps: ModalProps = {
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: () => 鉢の作成を実行する(),
    okButtonProps: {
      disabled: !isValid,
    },
    okText: '作成',
    cancelText: 'キャンセル',
    confirmLoading: isLoading,
  };

  const 鉢の作成を実行する = async () => {
    if (!user) return;
    // await withLoading(async () => {
    //   await 鉢.新規作成({ name: getValues().name, userId: user?.id });
    // });
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsOpen(true),
    };
  });

  return (
    <div className="鉢を作成モーダル">
      <Modal {...modalProps}>
        <h1>鉢を作成</h1>
        <MyInput controller={name} placeholder="鉢の名前" autoFocus={true} />
      </Modal>
    </div>
  );
});
