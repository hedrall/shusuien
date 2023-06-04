import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ModalProps } from 'antd';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { 棚ID } from '@frontend/domain/model/棚';
import { 鉢一覧 } from '@frontend/components/molecules/ItemList';

export namespace この棚の鉢一覧モーダル {
  export type Ref = {
    open: (棚Id: 棚ID) => void;
  };
  export type Props = {};
}

export const この棚の鉢一覧モーダル = forwardRef<この棚の鉢一覧モーダル.Ref, この棚の鉢一覧モーダル.Props>(
  (props, ref) => {
    const [棚Id, set棚Id] = useState<棚ID | null>(null);

    const open = (棚Id: 棚ID) => set棚Id(棚Id);

    const modalProps: ModalProps = {
      className: 'この棚の鉢一覧モーダル',
      open: !!棚Id,
      onCancel: () => set棚Id(null),
      okButtonProps: { style: { display: 'none' } },
      cancelText: '閉じる',
      destroyOnClose: true,
    };

    useImperativeHandle(ref, () => ({ open }));

    return (
      <Modal {...modalProps}>
        <モーダルの見出し type="成長の記録" />
        {棚Id ? <鉢一覧 棚Id={棚Id} /> : null}
      </Modal>
    );
  },
);
