import React, { useEffect } from 'react';
import { AuthRepository } from '@frontend/domain/repository/auth';
import { useAuthState } from '@frontend/store/auth/action';

export const Utils: React.FC<{}> = () => {
  const { authStateChangeSubscriber } = useAuthState();
  useEffect(() => {
    AuthRepository.listen.authStateChanged(authStateChangeSubscriber);
  }, []);
  return null;
};
