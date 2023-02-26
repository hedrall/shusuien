import React, { MouseEventHandler } from 'react';

const onEnterKeyDownHandler = (code: string, callback: CallableFunction) => {
  if (code !== 'Enter') return;
  callback();
};
export const onKeyEnter = (callback: CallableFunction): { onKeyDown: React.KeyboardEventHandler } => {
  return {
    onKeyDown: e => onEnterKeyDownHandler(e.code, callback),
  };
};

namespace OnClickOrEnter {
  export type Res = {
    onKeyDown: React.KeyboardEventHandler;
    onClick: MouseEventHandler<any>;
  };
}
export const onClickOrEnter = (callback: CallableFunction): OnClickOrEnter.Res => {
  return {
    onKeyDown: e => onEnterKeyDownHandler(e.code, callback),
    onClick: () => callback(),
  };
};
