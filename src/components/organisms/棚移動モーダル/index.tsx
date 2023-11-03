import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { Card, Modal, ModalProps } from 'antd';
import { useWithLoading } from '@frontend/supports/ui';
import { 棚ID } from 'src/domain/entity/棚';
import { 鉢 } from 'src/domain/entity/鉢';
import { use棚一覧 } from 'src/store/data/action';

export namespace 棚移動モーダル {
  export type Props = {
    on移動先の棚を選択: (id: 棚ID) => void;
  };
  export type Ref = {
    open: () => void;
  };
}
export const 棚移動モーダル = forwardRef<棚移動モーダル.Ref, 棚移動モーダル.Props>((props, ref) => {
  const { on移動先の棚を選択 } = props;

  // --- hooks ---
  const [isOpen, setIsOpen] = useState(false);
  const { 棚一覧 } = use棚一覧.一覧を利用();

  const close = () => {
    setIsOpen(false);
  };

  const 移動先を選択 = (id: 棚ID) => {
    on移動先の棚を選択(id);
    close();
  };

  const modalProps: ModalProps = {
    className: '棚移動モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    closable: false,
    okButtonProps: {
      style: { display: 'none' },
    },
    cancelText: 'キャンセル',
  };

  useImperativeHandle(ref, () => {
    return { open: () => setIsOpen(true) };
  });

  return (
    <div className="棚移動モーダル">
      <Modal {...modalProps}>
        <h1>棚を移動</h1>
        <div>
          {棚一覧.map(棚 => {
            return (
              <Card className="ListItem" key={棚.id} onClick={() => 移動先を選択(棚.id!)} bordered={false} size="small">
                {棚.name}
              </Card>
            );
          })}
        </div>
      </Modal>
    </div>
  );
});
