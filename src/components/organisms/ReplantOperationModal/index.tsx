import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useWithLoading } from '@frontend/supports/ui';
import { useAuthState } from '@frontend/store/auth/action';
import { Modal, ModalProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 履歴の内容, 鉢サイズ } from '@frontend/domain/model/history';
import dayjs from 'dayjs';
import { Control, useController, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { RadioGroup, RadioGroupOption } from '@frontend/components/atoms/RadioGroup';
import { MySwitch } from '@frontend/components/atoms/MySwitch';
import { MyFormLayout } from '@frontend/components/molecules/MyForm';
import { UploadImage } from '@frontend/components/atoms/UploadImage';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

export namespace 植替え操作モーダル {
  export type Ref = {
    open: (鉢: 鉢) => void;
  };
  export type Props = {};
}

type Input = {
  size: 鉢サイズ.番号;
  isLong: boolean;
  imageDataUrl: 履歴の内容.植替え['植替え後の画像のPATH'];
  date: string;
  memo: 履歴の内容.植替え['memo'];
};

const DATE_FORMAT = 'YYYY年DD月MM日';
const DEFAULT_VALUES: Partial<Input> = {
  size: '3',
  isLong: false,
  imageDataUrl: undefined,
  date: dayjs().format(DATE_FORMAT),
  memo: undefined,
};

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
    rules: { required: true },
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
    rule: { maxLength },
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

  const { control, getValues, formState } = useForm<Input>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const { size, isLong, imageDataUrl, date, memo } = createController(control);

  const modalProps: ModalProps = {
    className: '植替え操作モーダル',
    open: isOpen,
    onCancel: () => setIsOpen(false),
    // onOk: () => 棚の作成を実行する(),
    okButtonProps: {
      disabled: !formState.isValid,
    },
    okText: '作成',
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
      <h1>植替えを記録</h1>
      鉢名: {item?.name}
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
