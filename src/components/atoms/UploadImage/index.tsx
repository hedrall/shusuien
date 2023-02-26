import React from 'react';
import { Image, Upload, UploadFile } from 'antd';
import type { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { BrowserRepository } from '@frontend/domain/repository/browser';
import { useWithLoading } from '@frontend/supports/ui';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

export type UploadImageInput = string | undefined;
export type UploadImageProps = {
  field: ControllerRenderProps<any, any>;
  onFileSelect?: (file: File) => void;
};

export function UploadImage<Key extends string>(props: UploadImageProps) {
  const { field, onFileSelect } = props;
  const { withLoading, isLoading } = useWithLoading();
  const setImageUrl = (dataUrl?: string) => {
    field.onChange(dataUrl);
  };
  const imageUrl = field.value;

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      onFileSelect?.(info.file as any as File);
      await withLoading(async () => {
        const { dataUrl } = await BrowserRepository.Image.compressFileIfLarge(info.file.originFileObj as File);
        setImageUrl(dataUrl);
      });
    }
  };

  const uploadButton = (
    <div className="UploadButton">
      {isLoading ? <LoadingOutlined /> : <CameraOutlined />}
      <div>Upload</div>
    </div>
  );

  const uploadProps: UploadProps = {
    className: 'UploadImage',
    listType: 'picture',
    accept: 'image/jpg, image/jpeg, image/png',
    // onPreview: handlePreview,
    onChange: handleChange,
    customRequest: options => {
      const { onSuccess } = options;
      console.log('customRequest');
      onSuccess?.({});
    },
    onRemove: () => setImageUrl(undefined),
  };
  return (
    <>
      <Upload {...uploadProps}>
        {imageUrl ? (
          <Image src={imageUrl} style={{ width: '100%', maxHeight: '40vh', objectFit: 'contain' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
}
