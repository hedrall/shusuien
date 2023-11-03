import { Entity } from 'src/domain/entity';
import { 履歴 } from 'src/domain/entity/履歴';
import { 鉢 } from 'src/domain/entity/鉢';
import { 棚 } from 'src/domain/entity/棚';
import type fs from 'firebase/firestore';
import { User } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

export const dropUndefined = (obj: { [key: string]: any }) => {
  Object.keys(obj).map(key => {
    const value = obj[key];
    if (value === undefined) {
      obj[key] = null;
      return;
    }
    if (value === null) return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      obj[key] = dropUndefined(value);
      return;
    }
  });
  return obj;
};

export const dateToFirestore = (obj: { [key: string]: any }) => {
  Object.keys(obj).map(key => {
    const value = obj[key];
    if (value instanceof dayjs) {
      obj[key] = (value as Dayjs).format();
      return;
    }
    if (value === null) return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      obj[key] = dateToFirestore(value);
      return;
    }
  });
  return obj;
};
export const removeId = (obj: { [key: string]: any }) => {
  const { id, ...rest } = obj;
  return rest;
};

export const basicToFirestore = <T extends object>(item: T): fs.DocumentData => {
  const mod = dateToFirestore(dropUndefined(removeId({ ...item })));
  return JSON.parse(JSON.stringify(mod));
};

export const basicFromFirestore = <T extends Entity>(construct: new (...args: any[]) => T) => {
  return (snapshot: fs.QueryDocumentSnapshot<fs.DocumentData>): T => {
    const data = snapshot.data() as T;
    const id = snapshot.ref.id;
    return new construct({ ...data, id });
  };
};

export const basicConverter = <T extends Entity>(
  construct: new (...args: any[]) => T,
): fs.FirestoreDataConverter<T> => {
  return {
    toFirestore: basicToFirestore,
    fromFirestore: basicFromFirestore(construct),
  };
};

export const appConverters = {
  棚: basicConverter(棚),
  鉢: basicConverter(鉢),
  履歴: basicConverter(履歴),
  User: basicConverter(User),
  植物ごとのデフォルト設定: basicConverter(植物ごとのデフォルト設定),
  棚の並び順: basicConverter(棚の並び順),
} as const;
