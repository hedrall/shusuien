import { 棚 as Domainの棚 } from 'src/domain/entity/棚';
import { 鉢 as Domainの鉢 } from 'src/domain/entity/鉢';
import { 履歴 as Domainの履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { User as DomainのUser } from 'src/domain/entity/user';
import { 植物ごとのデフォルト設定 as Domainの植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { 棚の並び順 as Domainの棚の並び順 } from 'src/domain/entity/棚の並び順';
import fs from 'firebase/firestore';
import { Entity } from 'src/domain/entity';

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
  export class 植物ごとのデフォルト設定<C extends Converter<Domainの植物ごとのデフォルト設定>>
    implements FsManager<Domainの植物ごとのデフォルト設定, C>
  {
    static _name = '植物ごとのデフォルト設定';
    static createPath = () => 植物ごとのデフォルト設定._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = 植物ごとのデフォルト設定.createPath();
    }
  }
  export class 棚の並び順<C extends Converter<Domainの棚の並び順>> implements FsManager<Domainの棚の並び順, C> {
    static _name = '棚の並び順';
    static createPath = () => 棚の並び順._name;
    path: string;
    converter: C;

    constructor(converter: C) {
      this.converter = converter;
      this.path = 棚の並び順.createPath();
    }
  }
}
