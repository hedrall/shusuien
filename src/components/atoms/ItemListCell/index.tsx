import React from 'react';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { Image, ImageProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢, imageUrl: string | undefined) => void;
};

export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択 } = props;

  const { imageUrl } = StorageRepository.鉢.use画像(item.snapshot.画像のPATH);

  const imageProps: ImageProps = {
    className: '鉢一覧の要素',
    preview: false,
    src: imageUrl || NO_IMAGE,
    style: { borderRadius: 7 },
    onClick: () => 鉢を選択(item, imageUrl),
  };
  return <Image {...imageProps} />;
};
