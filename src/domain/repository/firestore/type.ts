import fs from 'firebase/firestore';

export type RefValue<T> = {
  ref: fs.DocumentReference<T>;
  value: T;
};
