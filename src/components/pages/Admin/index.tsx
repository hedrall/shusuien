import React, { useEffect, useState } from 'react';
import { useAuthState } from '@frontend/store/auth/action';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 棚ID } from '@frontend/domain/model/tana';
import { 鉢 } from '@frontend/domain/model/item';
import { MyButton } from '@frontend/components/atoms/MyButton';
import * as fs from 'firebase/firestore';
import querySnapshotToRefValues = FSAppRepository.querySnapshotToRefValues;
import { StorageRepository } from '@frontend/domain/repository/storage';

export type TopPageProps = {};

export const AdminPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();
  const userId = user?.id;

  if (!user) return null;
  if (userId && userId !== 'DxHELmn516Zz0at4Kkn2U4uCKCp2') return null;

  const 鉢の画像PATHをURLに載せ替える = async () => {
    const db = () => fs.getFirestore();
    const col = fs.collection(db(), '鉢');
    const query = fs.query(
      col,
      fs.where('userId', '==', userId),
      fs.where('棚Id', '==', 'P91BSdjKv7ZXbtT0C55N'),
      fs.orderBy('作成日時', 'asc'),
    );
    const docs = await fs.getDocs(query);
    const { refValue: values } = querySnapshotToRefValues(docs);
    console.log({ values: values.map(i => i.value) });

    for (const item of values) {
      const value = item.value;
      if (value.snapshot['画像のPATH']) {
        const url = await StorageRepository.getDownloadUrls(value.snapshot['画像のPATH']);
        console.log('download url');
        if (!url) throw new Error('url nasi');
        console.log('update', item.ref.id);
        await fs.updateDoc(item.ref, {
          'snapshot.画像のURL': url,
        });
      }
    }
  };

  const 履歴の画像PATHをURLに載せ替える = async () => {
    const db = () => fs.getFirestore();
    const col = fs.collection(db(), '履歴');
    const query = fs.query(col, fs.where('userId', '==', userId));

    const docs = await fs.getDocs(query);
    const { refValue: values } = querySnapshotToRefValues(docs);
    console.log({ values: values.map(i => i.value) });

    for (const item of values) {
      const value = item.value;
      const key = value['内容']['植替え後の画像のPATH'] ? '植替え後の画像のURL' : '画像のURL';
      const path = value['内容']['植替え後の画像のPATH'] || value['内容']['画像のPATH'];
      if (path && path.includes('http')) continue;
      if (path) {
        console.log('download url', path);
        const url = await StorageRepository.getDownloadUrls(path);
        if (!url) throw new Error('url nasi');
        console.log('update', item.ref.id);
        await fs.updateDoc(item.ref, {
          [`内容.${key}`]: url,
        });
      }
    }
  };
  return (
    <div>
      <h1>admin</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MyButton title="鉢の画像PATHをURLに載せ替える" onClick={鉢の画像PATHをURLに載せ替える} />
        <MyButton title="履歴の画像PATHをURLに載せ替える" onClick={履歴の画像PATHをURLに載せ替える} />
      </div>
    </div>
  );
};
