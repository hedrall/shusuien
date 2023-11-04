import { ClassEntity, MixinEntity } from 'src/domain/entity';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
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

export const mixinBasicToFirestore = <T extends object>(item: T): fs.DocumentData => {
  const mod = dateToFirestore(dropUndefined(removeId({ ...item })));
  return JSON.parse(JSON.stringify(mod));
};

export const mixinBasicFromFirestore = <T extends Exclude<MixinEntity, 履歴>>(construct: (...args: any[]) => T) => {
  return (snapshot: fs.QueryDocumentSnapshot<fs.DocumentData>): T => {
    const data = snapshot.data() as T;
    const id = snapshot.ref.id;
    return construct({ ...data, id });
  };
};

export const mixinBasicConverter = <T extends Exclude<MixinEntity, 履歴>>(
  construct: (...args: any[]) => T,
): fs.FirestoreDataConverter<T> => {
  return {
    toFirestore: mixinBasicToFirestore,
    fromFirestore: mixinBasicFromFirestore(construct),
  };
};

export const 履歴Converter: fs.FirestoreDataConverter<履歴> = {
  toFirestore: (item: 履歴): fs.DocumentData => {
    const mod = dateToFirestore(dropUndefined(removeId({ ...item })));
    return JSON.parse(JSON.stringify(mod));
  },
  fromFirestore: <T extends 履歴>(snapshot: fs.QueryDocumentSnapshot<fs.DocumentData>): T => {
    const data = snapshot.data() as T;
    const id = snapshot.ref.id;
    switch (data.内容.type) {
      case '成長の記録':
        return 履歴.成長の記録.construct({ ...(data as 履歴.成長の記録), id: id as 履歴.成長の記録.Id }) as T;
      case '植替え':
        return 履歴.植替え.construct({ ...(data as 履歴.植替え), id: id as 履歴.植替え.Id }) as T;
      case '灌水':
        return 履歴.灌水.construct({ ...(data as 履歴.灌水), id: id as 履歴.灌水.Id }) as T;
    }
    // @ts-expect-error
    throw new Error(`履歴Converter > fromFirestore > 予期せぬタイプ ${data.内容.type}`);
  },
};

export const appConverters = {
  棚: mixinBasicConverter(棚.construct),
  鉢: mixinBasicConverter(鉢.construct),
  履歴: 履歴Converter,
  User: mixinBasicConverter(User.construct),
  植物ごとのデフォルト設定: mixinBasicConverter(植物ごとのデフォルト設定.construct),
  棚の並び順: mixinBasicConverter(棚の並び順.construct),
} as const;
