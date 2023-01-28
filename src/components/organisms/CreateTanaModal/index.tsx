import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ModalProps } from 'antd';

export namespace 棚を作成モーダル {
  export type Props = {};
  export type Ref = {
    open: () => void;
  };
}

export const 棚を作成モーダル = forwardRef<棚を作成モーダル.Ref, 棚を作成モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValue, setFormValue] = useState({});

  const 棚の作成を実行する = () => {};
  const modalProps: ModalProps = {
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: 棚の作成を実行する,
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
        aaaa....
      </Modal>
    </div>
  );
});
