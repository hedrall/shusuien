import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { 履歴の内容 } from '@frontend/domain/model/history';
import { Control, useController, useForm } from 'react-hook-form';
import { RadioGroupOption } from '@frontend/components/atoms/RadioGroup';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { VerticalRadioGroup } from '@frontend/components/atoms/VerticalRadioGroup';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import dayjs from 'dayjs';

export namespace 灌水モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

type Input = {
  amount: 履歴の内容.灌水.量のKey型;
};

const DEFAULT_VALUES: Partial<Input> = {
  amount: 履歴の内容.灌水.量の定義['流れ出るくらい'].key,
};

const createController = (control: Control<Input, any>) => {
  const amount = useController({
    control,
    name: 'amount',
    rules: { required: true },
  });
  return { amount };
};

const 灌水量の選択肢: RadioGroupOption<履歴の内容.灌水.量のKey型>[] = Object.values(履歴の内容.灌水.量の定義).map(
  def => {
    return {
      name: def.表示名,
      value: def.key,
    };
  },
);
export const 灌水モーダル = forwardRef<灌水モーダル.Ref, 灌水モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const [item, setItem] = useState<鉢 | null>(null);
  const { user } = useAuthState();

  const { control, getValues, formState, reset } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const { amount } = createController(control);

  const close = () => {
    setIsOpen(false);
    setItem(null);
    reset();
  };
  const 灌水を実行する = async () => {
    if (!user || !item) return;
    await withLoading(async () => {
      const { amount } = getValues();

      await 鉢.管理.灌水({
        userId: user.id,
        item,
        灌水量: amount,
      });
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
    okText: '植替えを記録する',
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
            input: <VerticalRadioGroup field={amount.field} options={灌水量の選択肢} />,
          },
        ]}
      />
    </Modal>
  );
});
