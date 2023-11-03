import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps } from 'antd';
import { Control, useController, UseControllerReturn, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';
import { 季節 } from '@frontend/domain/const/季節';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { 日光の強度設定 } from 'src/domain/entity/鉢/日光の強度設定';
import { 日光の強度 } from 'src/domain/entity/鉢/日光の強度';

export namespace 植物ごとのデフォルト設定の新規作成モーダル {
  export type Ref = {
    open: () => void;
  };
  export type Props = {};
}

type Input = {
  科: string | undefined;
  属: string | undefined;
  種: string | undefined;
  耐寒温度: number | undefined;
  水切れ日数: number | undefined;
  日光の強度設定: 日光の強度設定;
};

const DEFAULT_VALUES = (): Partial<Input> => ({
  科: undefined,
  属: undefined,
  種: undefined,
  耐寒温度: undefined,
  水切れ日数: undefined,
  日光の強度設定: {
    春: undefined,
    夏: undefined,
    秋: undefined,
    冬: undefined,
  },
});

const maxLength: ValidationRule<number> = { value: 80, message: '最大400文字までです。' };
const createController = (control: Control<Input, any>) => {
  const 科 = useController({
    control,
    name: '科',
    rules: { required: true, maxLength },
  });
  const 属 = useController({
    control,
    name: '属',
    rules: { required: true, maxLength },
  });
  const 種 = useController({
    control,
    name: '種',
    rules: { maxLength },
  });
  const 耐寒温度 = useController({
    control,
    name: '耐寒温度',
  });
  const 水切れ日数 = useController({
    control,
    name: '水切れ日数',
  });
  const 日光の強度設定 = Object.values(季節).reduce((pre, s) => {
    return {
      ...pre,
      [s]: useController({
        control,
        name: `日光の強度設定.${s}`,
        rules: { maxLength },
      }),
    };
  }, {} as Record<季節, UseControllerReturn<Input['日光の強度設定'], 季節>>);

  return { 科, 属, 種, 耐寒温度, 水切れ日数, 日光の強度設定 };
};

export const 植物ごとのデフォルト設定の新規作成モーダル = forwardRef<
  植物ごとのデフォルト設定の新規作成モーダル.Ref,
  植物ごとのデフォルト設定の新規作成モーダル.Props
>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const { user } = useAuthState();

  const { control, getValues, reset, setValue, formState } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES(),
  });
  const isValid = formState.isValid;
  const { 科, 属, 種, 耐寒温度, 水切れ日数, 日光の強度設定 } = createController(control);

  const close = () => {
    setIsOpen(false);
    reset();
  };

  const 作成を実行する = async () => {
    if (!user?.id) return;
    await withLoading(async () => {
      const values = getValues();
      await 植物ごとのデフォルト設定.作成({
        ...values,
        userId: user.id,
      });
      close();
    });
  };

  const modalProps: ModalProps = {
    className: '植物ごとのデフォルト設定モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: 作成を実行する,
    okButtonProps: {
      disabled: !isValid,
    },
    okText: '設定を登録',
    cancelText: '閉じる',
    confirmLoading: isLoading,
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return { open: () => setIsOpen(true) };
  });

  const 日光の強度SelectProps = (key: 季節): 日光の強度Select.Props => {
    const field = 日光の強度設定[key].field;
    return {
      onChange: e => field.onChange(e as 日光の強度),
      value: field.value,
      isLoading,
      size: 'small',
    };
  };

  return (
    <Modal {...modalProps}>
      <モーダルの見出し type="植物ごとのデフォルト設定" />
      <MyFormLayout
        items={[
          {
            label: '* 科',
            input: <MyInputWithAlert controller={科} inputProps={{ autoFocus: true }} />,
          },
          {
            label: '* 属',
            input: <MyInputWithAlert controller={属} />,
          },
          {
            label: '種',
            input: <MyInputWithAlert controller={種} />,
          },
          {
            label: '耐寒温度',
            input: <MyInputWithAlert controller={耐寒温度} />,
          },
          {
            label: '水切れ日数',
            input: <MyInputWithAlert controller={水切れ日数} />,
          },
          {
            label: '日光の強度設定',
            items: Object.values(季節).map(s => {
              return {
                label: s,
                input: <日光の強度Select {...日光の強度SelectProps(s)} />,
              };
            }),
          },
        ]}
      />
    </Modal>
  );
});
