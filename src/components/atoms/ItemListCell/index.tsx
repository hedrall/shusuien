import React, { useEffect, useState } from 'react';
import { StorageRepository } from '@frontend/domain/repository/storage';
import { Col, Image, ImageProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';

export type HachiProps = {
  item: 鉢;
  鉢を選択: (鉢: 鉢) => void;
};

export const 鉢一覧の要素: React.FC<HachiProps> = props => {
  const { item, 鉢を選択 } = props;
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const path = item.snapshot.画像のPATH;
    if (!path) return;
    StorageRepository.getDownloadUrls(path).then(setImageUrl);
  }, [鉢]);

  const imageProps: ImageProps = {
    className: '鉢一覧の要素',
    preview: false,
    src: imageUrl,
    style: { borderRadius: 7 },
    onClick: () => 鉢を選択(item),
  };
  return <Image {...imageProps} />;
};
