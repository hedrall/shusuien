import { useState } from 'react';

export const useWithLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = async (fn: (...args: any[]) => Promise<any>) => {
    setIsLoading(true);
    try {
      await fn();
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    // setIsLoading,
    withLoading,
  };
};
