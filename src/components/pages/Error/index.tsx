import React from 'react';
import './index.scss';

export type ErrorProps = {};

export const ErrorPage: React.FC<ErrorProps> = props => {
  return <div className="Error">Error page</div>;
};
