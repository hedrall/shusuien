import React from 'react';
import './index.scss';
import { useAuthState } from '@frontend/store/auth/action';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { 鉢 } from 'src/domain/entity/鉢';
import { MyButton } from '@frontend/components/atoms/MyButton';
import * as fs from 'firebase/firestore';
import { StorageRepository } from '@frontend/domain/repository/storage';
import dayjs from 'dayjs';
import { 小画像の生成 } from 'src/domain/entity/鉢/管理操作/新規作成';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import querySnapshotToRefValues = FSAppRepository.querySnapshotToRefValues;
import { 棚 } from 'src/domain/entity/棚';

export type TopPageProps = {};

const 鉢を全て取得する = async (userId: string) => {
  const db = () => fs.getFirestore();
  const col = fs.collection(db(), '鉢');
  const query = fs.query(
    col,
    fs.where('userId', '==', userId),
    fs.where('削除済み', '==', false),
    fs.orderBy('作成日時', 'asc'),
  );
  const docs = await fs.getDocs(query);
  const { refValue: values } = querySnapshotToRefValues(docs);

  console.table(
    values
      .map(v => v.value as 鉢)
      .map(v => {
        return {
          種名: v.詳細.種名,
          最後の灌水: v.snapshot.最後の灌水,
          水切れ日数: v.詳細.水切れ日数,
        };
      }),
  );
};

const 棚を全て取得する = async () => {
  const db = () => fs.getFirestore();
  const col = fs.collection(db(), '棚');
  const query = fs.query(col);
  const docs = await fs.getDocs(query);
  const { refValue: values } = querySnapshotToRefValues(docs);

  console.table(
    values
      .map(v => v.value as 棚)
      .map(v => {
        return {
          userId: v.userId,
          name: v.name,
        };
      }),
  );
};

const 鉢の画像PATHをURLに載せ替える = async (userId: string) => {
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
    if (value.snapshot.画像のPATH) {
      const url = await StorageRepository.getDownloadUrls(value.snapshot.画像のPATH);
      console.log('download url');
      if (!url) throw new Error('url nasi');
      console.log('update', item.ref.id);
      await fs.updateDoc(item.ref, {
        'snapshot.画像のURL': url,
      });
    }
  }
};

const 履歴の画像PATHをURLに載せ替える = async (userId: string) => {
  const db = () => fs.getFirestore();
  const col = fs.collection(db(), '履歴');
  const query = fs.query(col, fs.where('userId', '==', userId));

  const docs = await fs.getDocs(query);
  const { refValue: values } = querySnapshotToRefValues(docs);
  console.log({ values: values.map(i => i.value) });

  for (const item of values) {
    const value = item.value;
    const key = value.内容.植替え後の画像のPATH ? '植替え後の画像のURL' : '画像のURL';
    const path = value.内容.植替え後の画像のPATH || value.内容.画像のPATH;
    if (path?.includes('http')) continue;
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

const 削除済みにfalseを設定 = async (userId: string) => {
  // 鉢,履歴,棚
  const colName = '棚';
  console.log(colName, '削除済みにfalseを設定');
  const db = () => fs.getFirestore();
  const col = fs.collection(db(), colName);
  const query = fs.query(col, fs.where('userId', '==', userId));
  const docs = await fs.getDocs(query);
  const { refValue: values } = querySnapshotToRefValues(docs);

  for (const item of values) {
    console.log(`${1 + values.findIndex(i => i.ref.id === item.ref.id)}/${values.length}: ${item.ref.id}`);
    const { ref, value } = item;
    await fs.updateDoc(ref, { 削除済み: false });
  }
};

export const AdminPage: React.FC<TopPageProps> = props => {
  const { user } = useAuthState();
  const userId = user?.id;

  if (!user || !userId) return null;
  if (userId && userId !== 'DxHELmn516Zz0at4Kkn2U4uCKCp2') return null;

  const fetchImageBase64 = async (url: string): Promise<string> => {
    return new Promise(resolve => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = function () {
            resolve(this.result as string);
          }; // <--- `this.result` cojuntains a base64 data URI
          reader.readAsDataURL(blob);
        });
    });
  };

  // private/works/proxy-expressを起動してから実行することkoto
  const 小画像を作成する = async () => {
    const db = () => fs.getFirestore();
    const col = fs.collection(db(), '鉢');
    const query = fs.query(
      col,
      fs.where('userId', '==', userId),
      // fs.limit(1)
    );
    const docs = await fs.getDocs(query);
    const { refValue: values } = querySnapshotToRefValues(docs);

    for (const item of values) {
      const { ref, value } = item;
      const snapshot = value.snapshot as 鉢['snapshot'];
      if (snapshot.small画像のURL) {
        console.log(`${ref.id}: skip 1`);
        continue;
      }
      const 画像のURL = snapshot.画像のURL;
      if (!画像のURL) {
        console.log(`${ref.id}: skip 2`);
        continue;
      }
      // "https://firebasestorage.googleapis.com/v0/b/shusuien-dee8f.appspot.com/o/DxHELmn516Zz0at4Kkn2U4uCKCp2%2F%E9%89%A2%2F1oWMehOM82jAVONIhNkM%2F2023-02-13T09%3A08%3A50%2B09%3A00?alt=media&token=4c8b4a19-934b-4821-80e2-cbbe1f7eeffe"
      // https://firebasestorage.googleapis.com
      const modUrl = 画像のURL.replace('https://firebasestorage.googleapis.com', 'http://localhost:3031');
      const dataUrl = await fetchImageBase64(modUrl);

      const date = dayjs(decodeURIComponent(画像のURL).match(/2023.*\+09:00/)![0]);
      const { small画像のURL } = await 小画像の生成(dataUrl, {
        userId: userId!,
        datetime: date,
        itemId: ref.id as 鉢.Id,
      });
      await fs.updateDoc(ref, {
        'snapshot.small画像のURL': small画像のURL,
      });

      console.log({
        id: ref.id,
        small画像のURL,
      });
    }
  };

  return (
    <div>
      <h1>admin</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MyButton title="鉢を全て取得する" onClick={() => 鉢を全て取得する(userId)} />
        <MyButton title="棚を全て取得する" onClick={棚を全て取得する} />
        <MyButton title="鉢の画像PATHをURLに載せ替える" onClick={() => 鉢の画像PATHをURLに載せ替える(userId)} />
        <MyButton title="履歴の画像PATHをURLに載せ替える" onClick={() => 履歴の画像PATHをURLに載せ替える(userId)} />
        <MyButton title="小画像を作成する" onClick={小画像を作成する} />
        <MyButton title="削除済みにfalseを設定" onClick={() => 削除済みにfalseを設定(userId)} />
      </div>
    </div>
  );
};
