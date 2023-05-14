import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps } from 'antd';
import { 鉢 } from 'src/domain/model/鉢';
import { 履歴の内容, 鉢サイズ } from '@frontend/domain/model/履歴';
import dayjs from 'dayjs';
import { Control, useController, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { RadioGroup, RadioGroupOption } from '@frontend/components/atoms/RadioGroup';
import { MySwitch } from '@frontend/components/atoms/MySwitch';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { UploadImage } from '@frontend/components/atoms/UploadImage';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { DATE_TIME_FORMAT } from '@frontend/supports';
import { モーダルの見出し } from '@frontend/components/atoms/ModalTitle';

export namespace 植替え操作モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

type Input = {
  size: 鉢サイズ.番号;
  isLong: boolean;
  imageDataUrl: 履歴の内容.植替え['植替え後の画像のURL'];
  date: string;
  memo: 履歴の内容.植替え['memo'];
};

const DEFAULT_VALUES = (): Partial<Input> => ({
  size: '3',
  isLong: false,
  imageDataUrl: undefined,
  date: dayjs().format(DATE_TIME_FORMAT),
  memo: undefined,
});

const maxLength: ValidationRule<number> = { value: 400, message: '最大400文字までです。' };
const createController = (control: Control<Input, any>) => {
  const size = useController({
    control,
    name: 'size',
    rules: { required: true },
  });
  const isLong = useController({
    control,
    name: 'isLong',
  });
  const imageDataUrl = useController({
    control,
    name: 'imageDataUrl',
    rules: { required: '必須です。' },
  });
  const date = useController({
    control,
    name: 'date',
    rules: { required: '必須です。' },
  });
  const memo = useController({
    control,
    name: 'memo',
    rules: { maxLength },
  });
  return { size, isLong, imageDataUrl, date, memo };
};

const 鉢サイズの選択肢: RadioGroupOption<鉢サイズ.番号>[] = 鉢サイズ.番号.map(num => {
  return {
    name: `${num}号`,
    value: num,
  };
});
export const 植替え操作モーダル = forwardRef<植替え操作モーダル.Ref, 植替え操作モーダル.Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const [item, setItem] = useState<鉢 | null>(null);
  const { user } = useAuthState();

  const { control, getValues, formState, reset } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES(),
  });

  const { size, isLong, imageDataUrl, date, memo } = createController(control);

  const close = () => {
    setIsOpen(false);
    setItem(null);
    reset();
  };

  const 植替えを実行する = async () => {
    if (!user || !item) return;
    await withLoading(async () => {
      const { imageDataUrl, size, isLong, date, memo } = getValues();

      await 鉢.管理.植替え({
        imageDataUrl,
        userId: user.id,
        item,
        date: dayjs(date),
        鉢のサイズ: {
          番号: size,
          タイプ: isLong ? 'L' : '',
        },
        memo,
      });
      close();
    });
  };

  const modalProps: ModalProps = {
    className: '植替え操作モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: () => 植替えを実行する(),
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
      <モーダルの見出し type="植替え" />
      <MyFormLayout
        items={[
          {
            label: '植替え日時',
            input: <MyInputWithAlert controller={date} inputProps={{ readOnly: true }} />,
          },
          {
            label: '植替え後の画像を撮影📸',
            input: <UploadImage field={imageDataUrl.field} />,
          },
          {
            label: '鉢のサイズ',
            input: <RadioGroup field={size.field} options={鉢サイズの選択肢} />,
          },
          {
            label: 'ロングポット',
            input: <MySwitch field={isLong.field} />,
            type: 'oneLine',
            align: 'right',
          },
          {
            label: 'メモ (任意)',
            input: <MyInputWithAlert controller={memo} />,
          },
        ]}
      />
    </Modal>
  );
});
