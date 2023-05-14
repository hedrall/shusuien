import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Button, Input, InputRef, Modal, ModalProps, Row, Table } from 'antd';
import { 鉢 } from 'src/domain/model/鉢';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/植物のデフォルト設定';

export namespace デフォルト設定から選択するモーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

export const デフォルト設定から選択するモーダル = forwardRef<
  デフォルト設定から選択するモーダル.Ref,
  デフォルト設定から選択するモーダル.Props
>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const { user } = useAuthState();
  const { 植物ごとのデフォルト設定一覧: 設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();
  const [鉢, set鉢] = useState<鉢 | null>(null);
  const [filter, setFilter] = useState('');
  const inputRef = useRef<InputRef>(null);

  const close = () => {
    setIsOpen(false);
    set鉢(null);
    setFilter('');
  };

  const modalProps: ModalProps = {
    className: 'デフォルト設定から選択するモーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    okButtonProps: { style: { display: 'none' } },
    cancelText: '閉じる',
    confirmLoading: isLoading,
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return {
      open: (鉢: 鉢) => {
        setIsOpen(true);
        set鉢(鉢);
        setTimeout(() => {
          inputRef.current?.focus?.();
        }, 50);
      },
    };
  });

  const 選択 = async (設定: 植物ごとのデフォルト設定) => {
    if (!鉢) return;
    await withLoading(async () => {
      const { 科, 属, 種 } = 設定;
      if (科) await 鉢.詳細を更新('科', 科);
      if (属) await 鉢.詳細を更新('属', 属);
      if (種) await 鉢.詳細を更新('種名', 種);
    });
    close();
  };

  return (
    <Modal {...modalProps}>
      <モーダルの見出し type="デフォルト設定から選択" />

      <Row className="フィルター">
        絞り込み: <Input value={filter} onChange={e => setFilter(e.target.value)} ref={inputRef} />
      </Row>

      <Table
        columns={[
          ...['科', '属', '種'].map(key => {
            return {
              title: key,
              dataIndex: key,
              key: key,
            };
          }),
          {
            title: '',
            key: 'operation',
            render: (_, 設定) => {
              return (
                <Button loading={isLoading} onClick={() => 選択(設定)}>
                  選択する
                </Button>
              );
            },
          },
        ]}
        dataSource={設定一覧
          .filter(i => (filter ? [i.科, i.属, i.種].join('').includes(filter) : true))
          .map(i => ({ ...i, key: i.order }))}
        pagination={false}
      />
    </Modal>
  );
});
