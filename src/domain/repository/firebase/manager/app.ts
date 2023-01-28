import fs from 'firebase/firestore';
import { FsManager } from '@frontend/domain/repository/firebase/manager';
import { appConverters } from '@frontend/domain/repository/firebase/converters/app';

export type FsAppManager<T> = {
  path: string;
  converter: fs.FirestoreDataConverter<T>;
};
export namespace FsAppManager {
  export class 鉢 extends FsManager.鉢<typeof appConverters.鉢> {
    constructor() {
      super(appConverters.鉢);
    }
  }
  export class 棚 extends FsManager.棚<typeof appConverters.棚> {
    constructor() {
      super(appConverters.棚);
    }
  }
  export class 履歴 extends FsManager.履歴<typeof appConverters.履歴> {
    constructor() {
      super(appConverters.履歴);
    }
  }
}
