import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ModalProps } from 'antd';
import { useController, useForm } from 'react-hook-form';
import { useAuthState } from '@frontend/store/auth/action';
import { useWithLoading } from '@frontend/supports/ui';
import { UploadImage } from '@frontend/components/atoms/UploadImage';
import { 鉢 } from '@frontend/domain/model/item';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { 棚ID } from '@frontend/domain/model/tana';

export namespace 鉢作成モーダル {
  export type Props = {
    棚Id: 棚ID | undefined;
  };
  export type Ref = {
    open: () => void;
  };
}

type InputType = {
  name: string | undefined;
  imageDataUrl: string | undefined;
  科: string | undefined;
  属: string | undefined;
  種名: string | undefined;
  補足: string | undefined;
};

const DEFAULT_VALUES = {
  name: undefined,
  imageDataUrl: undefined,
  科: undefined,
  属: undefined,
  種名: undefined,
  補足: undefined,
};

export const 鉢作成モーダル = forwardRef<鉢作成モーダル.Ref, 鉢作成モーダル.Props>((props, ref) => {
  const { 棚Id } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, withLoading } = useWithLoading();
  const { user } = useAuthState();

  const { control, getValues, formState } = useForm<InputType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const maxLength: ValidationRule<number> = { value: 40, message: '最大40文字までです。' };
  const imageDataUrl = useController({
    control,
    name: 'imageDataUrl',
    rules: { required: '必須です。' },
  });
  const name = useController({
    control,
    name: 'name',
    rules: { maxLength },
  });
  const [科, 属, 種名, 補足] = (['科', '属', '種名', '補足'] as const).map(key => {
    return useController({
      control,
      name: key,
      rules: { maxLength },
    });
  });

  const modalProps: ModalProps = {
    open: isOpen,
    onCancel: () => setIsOpen(false),
    onOk: () => 鉢の作成を実行する(),
    okButtonProps: {
      disabled: !formState.isValid,
    },
    okText: '作成',
    cancelText: 'キャンセル',
    confirmLoading: isLoading,
  };

  const 鉢の作成を実行する = async () => {
    if (!user) return;
    await withLoading(async () => {
      const { imageDataUrl, name, ...詳細 } = getValues();
      console.warn({ getValues: getValues() });
      if (!棚Id || !imageDataUrl) return;
      await 鉢.新規作成({
        imageDataUrl,
        props: {
          userId: user?.id,
          name,
          詳細,
          棚Id,
        },
      });
    });
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsOpen(true),
    };
  });

  return (
    <Modal {...modalProps} className="鉢を作成モーダル">
      <h1>鉢を作成</h1>
      <div className="FormItem">
        <label>画像を選択</label>
        <UploadImage field={imageDataUrl.field} />
      </div>
      <div className="FormItem">
        <label>鉢の名前</label>
        <MyInputWithAlert controller={name} inputProps={{ placeholder: '鉢の名前' }} />
      </div>
      <div className="FormItem">
        <label>詳細な情報</label>
        <div>
          <MyInputWithAlert controller={科} inputProps={{ placeholder: '科' }} />
          <MyInputWithAlert controller={属} inputProps={{ placeholder: '属' }} />
          <MyInputWithAlert controller={種名} inputProps={{ placeholder: '種名' }} />
          <MyInputWithAlert controller={補足} inputProps={{ placeholder: '補足' }} />
        </div>
      </div>
    </Modal>
  );
});
