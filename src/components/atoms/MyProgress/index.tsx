import React, { CSSProperties, useState } from 'react';
import './index.scss';
import { ProgressProps } from 'antd/es/progress';
import { Progress } from 'antd';

type State = {
  total: number;
  done: number;
  status: undefined | 'exception';
} & { __progress_state: never };
namespace State {
  export const initial = (): State => {
    return {
      total: 0,
      done: 0,
      status: undefined,
    } as State;
  };
}
export const useProgress = () => {
  const [state, setState] = useState<State>(State.initial());
  return {
    state,
    start: (total: number) => {
      console.log('progress start', total);
      setState({ ...State.initial(), total });
    },
    progress: (n: number) => setState(cur => ({ ...cur, done: cur.done + n })),
    error: () => setState(cur => ({ ...cur, status: 'exception' })),
  };
};

export namespace MyProgress {
  export type Props = {
    state: State;
    style?: CSSProperties;
  };
}
export const MyProgress: React.FC<MyProgress.Props> = props => {
  const { state, style } = props;
  const progressProps: ProgressProps = {
    className: 'MyProgress',
    type: 'circle',
    percent: Math.ceil((state.done / state.total) * 100),
    status: state.status || 'normal',
    size: 'small',
    style,
  };
  return <Progress {...progressProps} />;
};
