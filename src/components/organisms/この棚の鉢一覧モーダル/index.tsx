import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { Modal, ModalProps } from 'antd';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { 棚 } from '@frontend/domain/model/棚';
import { 鉢一覧 } from '@frontend/components/molecules/ItemList';

export namespace この棚の鉢一覧モーダル {
  export type Ref = {
    open: (棚: 棚) => void;
  };
  export type Props = {};
}

export const この棚の鉢一覧モーダル = forwardRef<この棚の鉢一覧モーダル.Ref, この棚の鉢一覧モーダル.Props>(
  (props, ref) => {
    const [棚, set棚] = useState<棚 | null>(null);

    const open = (棚: 棚) => set棚(棚);

    const modalProps: ModalProps = {
      className: 'この棚の鉢一覧モーダル',
      open: !!棚,
      onCancel: () => set棚(null),
      okButtonProps: { style: { display: 'none' } },
      cancelText: '閉じる',
      destroyOnClose: true,
    };

    useImperativeHandle(ref, () => ({ open }));

    return (
      <Modal {...modalProps}>
        <h2>{棚?.name}</h2>
        {棚 ? <鉢一覧 棚Id={棚.id!} /> : null}
      </Modal>
    );
  },
);
