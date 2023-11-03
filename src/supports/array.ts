import { Entity } from 'src/domain/entity';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

export const findById = <T extends Exclude<Entity, 棚の並び順>>(arr: T[], idToFind: string | undefined | number) => {
  return arr.find(i => i.id === idToFind);
};

export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export type MayBeArray<T> = T | T[];

export const toArray = <T>(mayBeArray: MayBeArray<T>): T[] => {
  if (Array.isArray(mayBeArray)) {
    return mayBeArray;
  }

  return [mayBeArray];
};

export const toggleArray = <T>(
  array: T[],
  item: T,
): {
  items: T[];
  type: 'add' | 'remove';
} => {
  if (array.includes(item)) {
    return {
      type: 'remove',
      items: array.filter(i => i !== item),
    };
  }
  return {
    type: 'add',
    items: [...array, item],
  };
};
