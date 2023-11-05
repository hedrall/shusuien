import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { Modal, ModalProps } from 'antd';
import { useController, useForm } from 'react-hook-form';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { useWithLoading } from '@frontend/supports/ui';
import { 棚 } from 'src/domain/entity/棚';
import { User } from 'src/domain/entity/user';

export namespace ユーザ名設定モーダル {
  export type Props = {};
  export type Ref = {
    open: (user: User) => void;
  };
}

type InputType = {
  name: string;
};

/**
 * ユーザ名がセットされていない場合に強制的に見せるModal
 */
export const ユーザ名設定モーダル = forwardRef<ユーザ名設定モーダル.Ref, ユーザ名設定モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { isLoading, withLoading } = useWithLoading();

  const { control, getValues, setValue } = useForm<InputType>({
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
    onOk: () => ユーザ名を更新する(),
    okButtonProps: {
      disabled: !isValid,
    },
    closable: false,
    okText: '作成',
    confirmLoading: isLoading,
    cancelButtonProps: {
      style: { display: 'none' },
    },
  };

  const ユーザ名を更新する = async () => {
    if (!user) return;
    await withLoading(async () => {
      const newName = getValues().name;
      console.log(user, newName);
      await user.名前を変更する(newName);
    });
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => {
    return {
      open: (user: User) => {
        setUser(user);
        setIsOpen(true);
        setValue('name', user.名前が未設定() ? '' : user.name);
      },
    };
  });

  return (
    <div className="棚を作成モーダル">
      <Modal {...modalProps}>
        <h1>ユーザ名設定</h1>
        <p>未設定のユーザに表示されるようにしました。ユーザ名は適当でも大丈夫です。</p>
        <MyInput controller={name} placeholder="ユーザ名" autoFocus={true} />
      </Modal>
    </div>
  );
});
