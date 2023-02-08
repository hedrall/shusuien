import {
  getStorage as _getStorage,
  ref,
  uploadBytes,
  StorageReference,
  deleteObject,
  getDownloadURL,
  listAll,
} from 'firebase/storage';
import { ValueOf } from 'type-fest';

export namespace StorageRepository {
  export const 画像のPATH = {
    鉢: '鉢',
  };
  export type T画像のPATH = ValueOf<typeof 画像のPATH>;

  const getStorageRef = (): StorageReference => {
    const s = _getStorage();
    return ref(s);
  };

  const getStorageItemRef = (filePath: string) => {
    const storageRef = getStorageRef();
    return ref(storageRef, filePath);
  };

  export const getDownloadUrls = async (dirPath: string): Promise<string[]> => {
    const dirRef = getStorageItemRef(dirPath);
    const items = await listAll(dirRef);
    return await Promise.all(
      items.items.map(item => {
        return getDownloadURL(getStorageItemRef(item.fullPath));
      }),
    );
  };

  export const uploadImage = async (params: { filePath: T画像のPATH; file: File }) => {
    const { filePath, file } = params;
    const itemRef = getStorageItemRef(filePath);
    const res = await uploadBytes(itemRef, file);
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
}
