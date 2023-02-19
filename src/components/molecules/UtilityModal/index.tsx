import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps, Select, SelectProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { 履歴の内容 } from '@frontend/domain/model/history';
import { Control, useController, useForm } from 'react-hook-form';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { VerticalRadioGroup } from '@frontend/components/atoms/VerticalRadioGroup';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { 灌水量の選択肢 } from '@frontend/supports/selections';
import { OperationState } from '@frontend/store/operation/atom';
import { use一括灌水モード設定 } from '@frontend/store/operation/action';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { ICONS } from '@frontend/supports/icons';

export namespace 便利機能モーダル {
  export type Ref = {
    open: () => void;
  };
  export type Props = {};
}

const options = 灌水量の選択肢.map(({ name, value }) => ({ label: name, value }));

export const 便利機能モーダル = forwardRef<便利機能モーダル.Ref, 便利機能モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const 一括灌水モード = use一括灌水モード設定();

  const close = () => setIsOpen(false);

  const modalProps: ModalProps = {
    className: '便利機能モーダル',
    open: isOpen,
    onCancel: close,
    okButtonProps: {
      style: { display: 'none' },
    },
    cancelText: '閉じる',
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsOpen(true),
    };
  });

  const selectProps: SelectProps = {
    options,
    value: 一括灌水モード.state.灌水量,
    onChange: e => {
      一括灌水モード.灌水量をセット(e);
    },
  };

  return (
    <Modal {...modalProps}>
      <モーダルの見出し type="機能" />
      <div className="一括灌水">
        <MyButton
          title={
            <div>
              <ICONS.灌水 /> 一括灌水モード
            </div>
          }
          onClick={一括灌水モード.isをトグル}
          style={{ background: 一括灌水モード.state.ON ? '#0063F8' : '#525252' }}
        />
        <Select {...selectProps} />
      </div>
      {一括灌水モード.state.ON ? (
        <p className="一括灌水モードの補足">⚠️ 鉢のアイコンを押すと灌水を実行します。</p>
      ) : null}
    </Modal>
  );
});
