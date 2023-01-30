import { 棚 as Domainの棚 } from '@frontend/domain/model/tana';
import { 鉢 as Domainの鉢 } from '@frontend/domain/model/item';
import { 履歴 as Domainの履歴 } from '@frontend/domain/model/history';
import { User as DomainのUser } from '@frontend/domain/model/user';
import fs from 'firebase/firestore';
import { Entity } from '@frontend/domain/model';

type Converter<T> = fs.FirestoreDataConverter<T>;
export type FsManager<T extends Entity, C extends Converter<T>> = {
  path: string;
  converter: C;
};
// eslint-disable-next-line
export namespace FsManager {
  export class 棚<C extends Converter<Domainの棚>> implements FsManager<Domainの棚, C> {
    static _name = '棚';
    static createPath = () => 棚._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = 棚.createPath();
    }
  }
  export class 鉢<C extends Converter<Domainの鉢>> implements FsManager<Domainの鉢, C> {
    static _name = '鉢';
    static createPath = () => 鉢._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = 鉢.createPath();
    }
  }
  export class 履歴<C extends Converter<Domainの履歴>> implements FsManager<Domainの履歴, C> {
    static _name = '履歴';
    static createPath = () => 履歴._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = 履歴.createPath();
    }
  }
  export class User<C extends Converter<DomainのUser>> implements FsManager<DomainのUser, C> {
    static _name = 'user';
    static createPath = () => User._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = User.createPath();
    }
  }
}
