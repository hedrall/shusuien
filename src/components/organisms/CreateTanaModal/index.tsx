import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ModalProps } from 'antd';
import { useController, useForm } from 'react-hook-form';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { MyAlert } from '@frontend/components/atoms/MyAlert';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { useAuthState } from '@frontend/store/auth/action';

export namespace 棚を作成モーダル {
  export type Props = {};
  export type Ref = {
    open: () => void;
  };
}

type InputType = {
  name: string;
};

export const 棚を作成モーダル = forwardRef<棚を作成モーダル.Ref, 棚を作成モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
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
    onOk: () => 棚の作成を実行する(),
    okButtonProps: {
      disabled: !isValid,
    },
    okText: '作成',
    cancelText: 'キャンセル',
  };

  const 棚の作成を実行する = async () => {
    if (!user) return;
    await FSAppRepository.棚.作成(getValues().name, user?.id);
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsOpen(true),
    };
  });

  return (
    <div className="棚を作成モーダル">
      <Modal {...modalProps}>
        <h1>棚を作成</h1>
        <MyInput controller={name} placeholder="棚の名前" autoFocus={true} />
      </Modal>
    </div>
  );
});
