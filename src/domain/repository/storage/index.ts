import {
  getStorage as _getStorage,
  ref,
  uploadBytes,
  StorageReference,
  deleteObject,
  getDownloadURL,
  listAll,
  uploadString,
} from 'firebase/storage';
import { ValueOf } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { 鉢 } from '@frontend/domain/model/item';

export namespace StorageRepository {
  type StorageDirPathParams = {
    userId: UserId;
    type: '鉢';
    datetime: Dayjs;
    itemId: string;
    index?: number;
  };
  export const storagePath = (params: StorageDirPathParams) => {
    const { userId, type, datetime, itemId, index } = params;
    const postfix = index ? `_${index}` : '';
    const fileName = `${datetime.format()}${postfix}`;
    return [userId, type, itemId, fileName].join('/');
  };

  const getStorageRef = (): StorageReference => {
    const s = _getStorage();
    return ref(s);
  };

  const getStorageItemRef = (filePath: string) => {
    const storageRef = getStorageRef();
    return ref(storageRef, filePath);
  };

  export const getDownloadUrls = async (path: string): Promise<string> => {
    const ref = getStorageItemRef(path);
    return getDownloadURL(ref);
  };

  export const uploadImageByBase64String = async (params: { path: string; dataUrl: string }) => {
    const { path, dataUrl } = params;
    const itemRef = getStorageItemRef(path);
    const res = await uploadString(itemRef, dataUrl, 'data_url');
    return { 画像のPATH: res.ref.fullPath };
  };

  export const deleteItems = async (dirPath: string) => {
    const dirRef = getStorageItemRef(dirPath);
    const items = await listAll(dirRef);

    for (const item of items.items) {
      const path = item.fullPath;
      console.log('delete path: ', path);
      const ref = getStorageItemRef(path);
      await deleteObject(ref);
    }
  };

  export namespace 鉢 {
    export const use画像 = (鉢?: 鉢) => {
      const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
      useEffect(() => {
        console.log('鉢のimageを取得');
        if (!鉢?.snapshot.画像のPATH) return;
        const path = 鉢.snapshot.画像のPATH;
        StorageRepository.getDownloadUrls(path).then(setImageUrl);
      }, [鉢]);

      return { imageUrl, setImageUrl };
    };
  }
}
