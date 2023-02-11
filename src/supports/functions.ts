export const equalFn = <V>(value: V) => value;
export const typedToUpperCase = <T extends string>(text: T): Uppercase<T> => {
  return text.toUpperCase() as Uppercase<T>;
};

export const isDefined = <T>(value: T | undefined | null): value is Exclude<T, undefined | null> => {
  return value !== undefined && value !== null;
};

export const optionalCall = <T, R>(value: T | (undefined | null), callback: (value: T) => R): R | undefined => {
  if (!isDefined(value)) return undefined;
  return callback(value);
};

export const nullableCall = <T, R>(value: T | (undefined | null), callback: (value: T) => R) => {
  if (!isDefined(value)) return null;
  return callback(value);
};

export const toUnique = <T>(arr: T[]) => {
  return [...new Set(arr)];
};

export const sleep = async (time: number) => {
  await new Promise(resolve => setTimeout(resolve, time));
};

export const tObjectValues = <T extends object>(item: T) => {
  return Object.values(item) as T[keyof T][];
};
