import React from 'react';
import './index.scss';

export type ErrorProps = {};

export const Error: React.FC<ErrorProps> = props => {
  return <div className="Error">Error page</div>;
};
