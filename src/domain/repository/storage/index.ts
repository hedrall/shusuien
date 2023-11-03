import {
  deleteObject,
  getDownloadURL,
  getStorage as _getStorage,
  listAll,
  ref,
  StorageReference,
  uploadString,
} from 'firebase/storage';
import { UserId } from 'src/domain/entity/user';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

export namespace StorageRepository {
  type StorageDirPathParams = {
    userId: UserId;
    type: '鉢';
    datetime: Dayjs;
    itemId: string;
    index?: number | string;
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
    // export const 画像を取得 = async (画像のURL?: string) => {
    //   if (!画像のURL) return '';
    //   return StorageRepository.getDownloadUrls(画像のURL);
    // };
    // export const use画像 = (画像のURL?: string) => {
    //   const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    //   useEffect(() => {
    //     画像を取得(画像のURL).then(setImageUrl);
    //   }, [鉢]);
    //
    //   return { imageUrl, setImageUrl };
    // };
  }
}
