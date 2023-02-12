import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { useController, useForm } from 'react-hook-form';
import { Modal, ModalProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { MyInput } from '@frontend/components/atoms/MyInput';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 植替え操作モーダル } from '@frontend/components/organisms/ReplantOperationModal';

export namespace 鉢管理モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

export const 鉢管理モーダル = forwardRef<鉢管理モーダル.Ref, 鉢管理モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const [item, setItem] = useState<鉢 | null>(null);
  const { user } = useAuthState();
  const 植替え操作モーダルRef = useRef<植替え操作モーダル.Ref | null>(null);

  const modalProps: ModalProps = {
    className: '鉢管理モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    // onOk: () => 棚の作成を実行する(),
    okButtonProps: {
      // disabled: !isValid,
      style: { display: 'none' },
    },
    okText: '作成',
    cancelText: '閉じる',
    confirmLoading: isLoading,
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return {
      open: (鉢: 鉢) => {
        setItem(鉢);
        console.log(鉢);
        setIsOpen(true);
      },
    };
  });

  const 灌水モーダルを開く = () => {};
  const 植替えモーダルを開く = () => {
    if (!item) return;
    植替え操作モーダルRef.current?.open(item);
  };

  return (
    <Modal {...modalProps}>
      <h1>鉢のお手入れ</h1>鉢名: {item?.name}
      <h2>管理</h2>
      <div className="管理ボタン">
        <MyButton title={'灌水'} onClick={灌水モーダルを開く} />
        <MyButton title={'植替え'} onClick={植替えモーダルを開く} />
      </div>
      <植替え操作モーダル ref={植替え操作モーダルRef} />
    </Modal>
  );
});
