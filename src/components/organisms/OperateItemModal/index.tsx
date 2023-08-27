import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './index.scss';
import { useAuthState } from '@frontend/store/auth/action';
import { Image, Modal, ModalProps, Popconfirm } from 'antd';
import { 鉢, 鉢Id } from '@frontend/domain/model/鉢';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 植替え操作モーダル } from '@frontend/components/organisms/ReplantOperationModal';
import { 鉢の情報 } from '@frontend/components/molecules/ItemDesc';
import { NO_IMAGE } from '@frontend/supports/image';
import { use鉢単体 } from '@frontend/store/data/action';
import { 鉢の履歴 } from '@frontend/components/molecules/HistoryTimeline';
import { 灌水モーダル } from '@frontend/components/organisms/ProvideWater';
import { ICONS } from '@frontend/supports/icons';
import { 成長記録モーダル } from '@frontend/components/organisms/DocGrowthModal';
import { Button } from 'antd';
import { 植物ごとのデフォルト設定サービス } from '@frontend/domain/service/plantDefaultSetting';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { 水切れ日数簡易入力 } from '@frontend/components/atoms/水切れ日数簡易入力';

export namespace 鉢管理モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

const 水切れ日数のDEFAULT = 6;
export const 鉢管理モーダル = forwardRef<鉢管理モーダル.Ref, 鉢管理モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<鉢Id | undefined>(undefined);
  const { user } = useAuthState();
  const { item, setItem } = use鉢単体(id, user?.id);

  const 植替え操作モーダルRef = useRef<植替え操作モーダル.Ref | null>(null);
  const 灌水操作モーダルRef = useRef<灌水モーダル.Ref | null>(null);
  const 成長記録操作モーダルRef = useRef<成長記録モーダル.Ref | null>(null);

  const close = () => {
    setIsOpen(false);
    setId(undefined);
  };

  const modalProps: ModalProps = {
    className: '鉢管理モーダル',
    open: isOpen,
    onCancel: close,
    // onOk: () => 棚の作成を実行する(),
    okButtonProps: {
      // disabled: !isValid,
      style: { display: 'none' },
    },
    closable: true,
    okText: '作成',
    cancelText: '閉じる',
    destroyOnClose: true,
    width: '90vw',
    style: {
      maxWidth: 800,
    },
  };

  useImperativeHandle(ref, () => {
    return {
      open: (鉢: 鉢, imageUrl?: string) => {
        setItem(鉢);
        setId(鉢.id!);
        setIsOpen(true);
      },
    };
  });

  const 灌水モーダルを開く = () => {
    if (!item) return;
    灌水操作モーダルRef.current?.open(item);
  };
  const 植替えモーダルを開く = () => {
    if (!item) return;
    植替え操作モーダルRef.current?.open(item);
  };
  const 成長記録モーダルを開く = () => {
    if (!item) return;
    成長記録操作モーダルRef.current?.open(item);
  };

  const 鉢を削除 = async () => {
    await item?.削除();
    close();
  };

  const { 植物ごとのデフォルト設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();

  if (!item) return null;

  const デフォルト設定 = 植物ごとのデフォルト設定サービス.鉢の設定を特定(植物ごとのデフォルト設定一覧, item);

  return (
    <Modal {...modalProps}>
      <h1>鉢のお手入れ</h1>
      <div>
        <Image
          style={{ maxWidth: '100%', maxHeight: 250, minHeight: 174, objectFit: 'contain' }}
          src={item?.snapshot.画像のURL || NO_IMAGE}
        />
      </div>
      <h2 className="見出し">管理</h2>
      <div className="管理ボタン">
        <MyButton
          title={
            <div>
              <ICONS.灌水 /> 灌水
            </div>
          }
          onClick={灌水モーダルを開く}
        />
        <MyButton
          title={
            <div>
              <ICONS.植替え /> 植替え
            </div>
          }
          onClick={植替えモーダルを開く}
        />
        <MyButton
          title={
            <div>
              <ICONS.成長の記録 /> 成長記録
            </div>
          }
          onClick={成長記録モーダルを開く}
        />
      </div>
      <水切れ日数簡易入力
        鉢={item}
        鉢のデフォルト設定={デフォルト設定}
        onChange={value => item.詳細を更新('水切れ日数', value, true)}
      />
      <div className="液肥の表示">
        {item.snapshot.最後の液肥.日時 ? `(液肥: ${item.snapshot.最後の液肥.日時.format('MM月DD日')})` : null}
      </div>

      {item && <鉢の情報 鉢={item} />}
      <div>
        <Popconfirm
          title="この鉢を本当に削除してよろしいですか？"
          // description="Are you sure to delete this task?"
          onConfirm={鉢を削除}
          // onCancel={cancel}
          okText="削除"
          cancelText="キャンセル"
        >
          <Button danger>削除する</Button>
        </Popconfirm>
      </div>
      <h2 className="見出し">履歴</h2>
      <鉢の履歴 鉢={item} />

      {/* 以下、モーダル用のスロット */}
      <植替え操作モーダル ref={植替え操作モーダルRef} />
      <灌水モーダル ref={灌水操作モーダルRef} />
      <成長記録モーダル ref={成長記録操作モーダルRef} />
    </Modal>
  );
});
