import { useEffect, useState } from 'react';
import type { AsyncState } from '../types/asyncState';

export function useAsyncData<T>(loader: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        const data = await loader();
        if (isActive) setState({ status: 'success', data });
      } catch (error) {
        if (isActive) setState({ status: 'error', error });
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [loader]);

  return state;
}
