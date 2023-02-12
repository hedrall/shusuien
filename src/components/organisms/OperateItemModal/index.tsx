import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useAuthState } from '@frontend/store/auth/action';
import { Image, Modal, ModalProps } from 'antd';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 植替え操作モーダル } from '@frontend/components/organisms/ReplantOperationModal';
import { 鉢の情報 } from '@frontend/components/molecules/ItemDesc';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { NO_IMAGE } from '@frontend/supports/image';
import { use鉢単体 } from '@frontend/store/data/action';

export namespace 鉢管理モーダル {
  export type Ref = {
    open: (鉢: 鉢, imageUrl: string | undefined) => void;
  };
  export type Props = {};
}

export const 鉢管理モーダル = forwardRef<鉢管理モーダル.Ref, 鉢管理モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<鉢Id | undefined>(undefined);
  const { user } = useAuthState();
  const { item, setItem } = use鉢単体(id, user?.id);
  const { imageUrl, setImageUrl } = StorageRepository.鉢.use画像(item);
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
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return {
      open: (鉢: 鉢, imageUrl?: string) => {
        setItem(鉢);
        setImageUrl(imageUrl);
        setId(鉢.id!);
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
      <h1>鉢のお手入れ</h1>
      <div>
        <Image style={{ maxWidth: '100%', maxHeight: 250, minHeight: 174 }} src={imageUrl || NO_IMAGE} />
      </div>
      <h2 className="見出し">管理</h2>
      <div className="管理ボタン">
        <MyButton title={'灌水'} onClick={灌水モーダルを開く} />
        <MyButton title={'植替え'} onClick={植替えモーダルを開く} />
      </div>
      <div className="鉢の情報">{item && <鉢の情報 鉢={item} />}</div>
      <植替え操作モーダル ref={植替え操作モーダルRef} />
    </Modal>
  );
});
