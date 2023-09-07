import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/鉢';
import { 履歴の内容 } from '@frontend/domain/model/履歴';
import { Control, useController, useForm } from 'react-hook-form';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { VerticalRadioGroup } from '@frontend/components/atoms/VerticalRadioGroup';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { 灌水量の選択肢 } from '@frontend/supports/selections';
import { MySwitch } from '@frontend/components/atoms/MySwitch';

export namespace 灌水モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

type Input = {
  灌水量: 履歴の内容.灌水.量のKey型;
  液肥入り: boolean;
};

const DEFAULT_VALUES = (): Partial<Input> => ({
  灌水量: 履歴の内容.灌水.量の定義['鉢いっぱい'].key,
});

const createController = (control: Control<Input, any>) => {
  const 灌水量 = useController({
    control,
    name: '灌水量',
    rules: { required: true },
  });
  const 液肥入り = useController({
    control,
    name: '液肥入り',
  });
  return { 灌水量, 液肥入り };
};

export const 灌水モーダル = forwardRef<灌水モーダル.Ref, 灌水モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const [item, setItem] = useState<鉢 | null>(null);
  const { user } = useAuthState();

  const { control, getValues, formState, reset } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES(),
  });

  const { 灌水量, 液肥入り } = createController(control);

  const close = () => {
    setIsOpen(false);
    setItem(null);
    reset();
  };

  const 灌水を実行する = async () => {
    if (!user || !item) return;
    await withLoading(async () => {
      const { 灌水量, 液肥入り } = getValues();

      await 鉢.管理.灌水({ userId: user.id, item, 灌水量, 液肥入り });
      close();
    });
  };

  const modalProps: ModalProps = {
    className: '灌水モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: () => 灌水を実行する(),
    okButtonProps: {
      disabled: !formState.isValid,
    },
    okText: '灌水する',
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

  return (
    <Modal {...modalProps}>
      <モーダルの見出し type="灌水" />
      <MyFormLayout
        items={[
          {
            label: '灌水量',
            // @ts-ignore
            input: <VerticalRadioGroup field={灌水量.field} options={灌水量の選択肢} />,
          },
          {
            label: '液肥入り',
            input: <MySwitch field={液肥入り.field} />,
          },
        ]}
      />
    </Modal>
  );
});
