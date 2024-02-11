import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { ErrorPage, ErrorProps } from '@frontend/components/pages/Error/index';

describe('Error', () => {
  let container: HTMLElement;

  const props: ErrorProps = {};

  beforeAll(() => {
    const tree = render(<ErrorPage {...props} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
