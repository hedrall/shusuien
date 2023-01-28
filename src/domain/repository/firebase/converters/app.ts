import { Entity } from '@frontend/domain/model';
import { 履歴 } from '@frontend/domain/model/history';
import { 鉢 } from '@frontend/domain/model/item';
import { 棚 } from '@frontend/domain/model/tana';
import type fs from 'firebase/firestore';

export const dropUndefined = (obj: { [key: string]: any }) => {
  Object.keys(obj).map(key => {
    const value = obj[key];
    if (value === undefined) {
      obj[key] = null;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      obj[key] = dropUndefined(value);
    }
  });
  return obj;
};

export const basicToFirestore = <T extends object>(item: T): fs.DocumentData => {
  return dropUndefined({ ...item });
};

export const basicFromFirestore = <T extends Entity>(construct: new (...args: any[]) => T) => {
  return (snapshot: fs.QueryDocumentSnapshot<fs.DocumentData>): T => {
    const data = snapshot.data() as T;

    return new construct(data);
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
} as const;
