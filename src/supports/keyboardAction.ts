import React from 'react';

export const onKeyEnter = (callback: CallableFunction): { onKeyDown: React.KeyboardEventHandler } => {
  return {
    onKeyDown: e => {
      if (e.code !== 'Enter') return;
      callback();
    },
  };
};
