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
