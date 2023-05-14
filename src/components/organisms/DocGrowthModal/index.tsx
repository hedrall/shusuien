import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Checkbox, Modal, ModalProps } from 'antd';
import { 鉢 } from 'src/domain/model/鉢';
import { Control, useController, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { UploadImage } from '@frontend/components/atoms/UploadImage';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';

export namespace 成長記録モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

type Input = {
  imageDataUrl: string | undefined;
  memo: string | undefined;
  isUpdateImage: boolean;
};

const DEFAULT_VALUES = (): Partial<Input> => ({
  imageDataUrl: undefined,
  memo: undefined,
  isUpdateImage: false,
});

const maxLength: ValidationRule<number> = { value: 400, message: '最大400文字までです。' };
const createController = (control: Control<Input, any>) => {
  const imageDataUrl = useController({
    control,
    name: 'imageDataUrl',
    rules: { required: '必須です。' },
  });
  const memo = useController({
    control,
    name: 'memo',
    rules: { maxLength },
  });
  const isUpdateImage = useController({
    control,
    name: 'isUpdateImage',
  });
  return { imageDataUrl, memo, isUpdateImage };
};

export const 成長記録モーダル = forwardRef<成長記録モーダル.Ref, 成長記録モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const [item, setItem] = useState<鉢 | null>(null);
  const { user } = useAuthState();

  const open = (鉢: 鉢) => {
    setItem(鉢);
    console.log(鉢);
    setIsOpen(true);
  };

  const { control, getValues, reset, setValue } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES(),
  });
  const value = getValues();
  const isValid = value.imageDataUrl || value.memo;

  const { imageDataUrl, memo, isUpdateImage } = createController(control);

  useEffect(() => {
    if (value.imageDataUrl) {
      setValue('isUpdateImage', true);
    }
  }, [value.imageDataUrl]);

  const close = () => {
    setIsOpen(false);
    setItem(null);
    reset();
  };

  const 成長記録を実行する = async () => {
    if (!user || !item) return;
    await withLoading(async () => {
      const { imageDataUrl, memo, isUpdateImage } = getValues();

      await 鉢.管理.成長を記録({
        item,
        userId: user.id,
        imageDataUrl,
        memo,
        画像を更新する: isUpdateImage,
      });
      close();
    });
  };

  const modalProps: ModalProps = {
    className: '成長記録モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: () => 成長記録を実行する(),
    okButtonProps: {
      disabled: !isValid,
    },
    okText: '成長を記録',
    cancelText: '閉じる',
    confirmLoading: isLoading,
    destroyOnClose: true,
  };

  useImperativeHandle(ref, () => {
    return {
      open: open,
    };
  });

  return (
    <Modal {...modalProps}>
      <モーダルの見出し type="成長の記録" />
      <MyFormLayout
        items={[
          {
            label: '画像を撮影📸',
            input: <UploadImage field={imageDataUrl.field} />,
          },
          {
            label: 'メモ (任意)',
            input: <MyInputWithAlert controller={memo} />,
          },
        ]}
      />
      <Checkbox
        checked={isUpdateImage.field.value}
        onChange={isUpdateImage.field.onChange}
        disabled={!value.imageDataUrl}
      >
        メイン画像を更新する
      </Checkbox>
    </Modal>
  );
});
