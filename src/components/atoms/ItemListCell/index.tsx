import React from 'react';
import { Avatar, AvatarProps, Image, ImageProps } from 'antd';
import { 鉢 } from '@frontend/domain/model/item';
import { NO_IMAGE } from '@frontend/supports/image';

export type 鉢一覧の要素Props = {
  item: 鉢;
  鉢を選択: (鉢: 鉢) => void;
};

export const 鉢一覧の要素: React.FC<鉢一覧の要素Props> = props => {
  const { item, 鉢を選択 } = props;

  const imageProps: ImageProps = {
    className: '鉢一覧の要素',
    preview: false,
    src: item.snapshot.small画像のURL || item.snapshot.画像のURL || NO_IMAGE,
    style: { borderRadius: 7, aspectRatio: '1', objectFit: 'cover' },
    onClick: () => 鉢を選択(item),
  };
  return <Image {...imageProps} />;
  // return <Avatar {...avatarProps} />;
};
