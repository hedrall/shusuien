import * as fs from 'firebase/firestore';
import { Entity } from '@frontend/domain/model';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { MayBeArray, toArray } from '@frontend/supports/array';
import { _FsApp棚Repository } from '@frontend/domain/repository/firestore/tana';
import { _FsApp鉢Repository } from '@frontend/domain/repository/firestore/item';
import { _FsApp履歴Repository } from '@frontend/domain/repository/firestore/history';

export namespace FSAppRepository {
  type DocumentSnapshot<T> = fs.DocumentSnapshot<T>;
  type QuerySnapshot<T> = fs.QuerySnapshot<T>;
  type CollectionReference<T extends Entity> = fs.CollectionReference<T>;

  const db = () => fs.getFirestore();

  export const getCollection = <T extends Entity>(manager: FsAppManager<T>): CollectionReference<T> => {
    const collection = fs.collection(db(), manager.path);
    return collection.withConverter<T>(manager.converter);
  };

  export const querySnapshotToRefValues = <T>(snapshot: QuerySnapshot<T>) => {
    const refValue: RefValue<T>[] = [];

    let lastDocSnapshot: DocumentSnapshot<unknown> | undefined = undefined;
    snapshot.forEach(item => {
      lastDocSnapshot = item;
      refValue.push({
        ref: item.ref,
        value: item.data(),
      });
    });
    return { refValue, lastDocSnapshot };
  };

  export const documentSnapshotToRefValue = <T>(snapshot: DocumentSnapshot<T>): RefValue<T> => {
    return {
      ref: snapshot.ref,
      value: snapshot.data() as T,
    };
  };

  type QueryCondition = {
    limit?: number;
    offset?: number;
    wheres?: fs.QueryConstraint[];
    orderBy?: MayBeArray<{ key: string; dir: 'asc' | 'desc' }>;
    startAfter?: fs.DocumentSnapshot<unknown>;
  };
  const getQuery = <T extends Entity>(
    collection: fs.CollectionReference<T>,
    { limit, wheres, orderBy, startAfter }: QueryCondition,
  ) => {
    const conditions: fs.QueryConstraint[] = [];

    if (orderBy) {
      for (const { key, dir } of toArray(orderBy)) {
        conditions.push(fs.orderBy(key, dir));
      }
    }
    if (startAfter) conditions.push(fs.startAfter(startAfter));
    if (limit) conditions.push(fs.limit(limit));

    return fs.query(collection, ...(wheres || []), ...conditions);
  };
  export const getItems = async <T extends Entity>(manager: FsAppManager<T>, conditions: QueryCondition) => {
    const collection = getCollection<T>(manager);
    const query = getQuery(collection, conditions);
    const res = querySnapshotToRefValues(await fs.getDocs(query));
    return {
      items: res.refValue,
      lastDocSnapshot: res.lastDocSnapshot,
    };
  };

  export const getItem = async <T extends Entity>(manager: FsAppManager<T>, id: string): Promise<RefValue<T>> => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, id);
    const res = await fs.getDoc(doc);
    return documentSnapshotToRefValue(res);
  };

  export const count = async <T extends Entity>(manager: FsAppManager<T>) => {
    const collection = getCollection(manager);
    const res = await fs.getDocs(collection);
    return res.size;
  };

  export const addItem = async <T extends Entity>(manager: FsAppManager<T>, entity: T) => {
    const collection = getCollection(manager);
    return await fs.addDoc(collection, entity);
  };

  export const addItemWithId = async <T extends Entity & { id: string }>(manager: FsAppManager<T>, entity: T) => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, entity.id);
    await fs.setDoc(doc, entity);
  };

  export const isExist = async <T extends Entity>(manager: FsAppManager<T>, id: string) => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, id);
    const item = await fs.getDoc(doc);
    return item.exists();
  };

  export const update = async <T extends Entity>(manager: FsAppManager<T>, id: string, attrs: fs.UpdateData<T>) => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, id);
    await fs.updateDoc(doc, attrs);
  };

  export const deleteItem = async <T extends Entity>(manager: FsAppManager<T>, id: string) => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, id);
    await fs.deleteDoc(doc);
  };

  export const listenById = <T extends Entity>(
    manager: FsAppManager<T>,
    id: string,
    onListen: (value: RefValue<T>) => void,
  ): { unsubscribe: () => void } => {
    const collection = getCollection(manager);
    const doc = fs.doc(collection, id);
    const unsubscribe = fs.onSnapshot(doc, docSnapshot => {
      onListen(documentSnapshotToRefValue(docSnapshot));
    });
    return { unsubscribe };
  };
  export const listenList = <T extends Entity>(
    manager: FsAppManager<T>,
    condition: QueryCondition,
    onListen: (value: RefValue<T>[]) => void,
  ): { unsubscribe: () => void } => {
    const collection = getCollection(manager);
    const query = getQuery(collection, condition);
    const unsubscribe = fs.onSnapshot(query, querySnapshot => {
      const parsed = querySnapshotToRefValues(querySnapshot);
      onListen(parsed.refValue);
    });
    return { unsubscribe };
  };
  export import 棚 = _FsApp棚Repository;
  export import 鉢 = _FsApp鉢Repository;
  export import 履歴 = _FsApp履歴Repository;
}
