import { Subject } from 'rxjs';
import { useEffect, useState } from 'react';

export const useSubscribeState = <T>(stream: Subject<T>): T | undefined => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const unsub = stream.subscribe(event => setState(event));
    return () => unsub.unsubscribe();
  }, []);

  return state;
};
