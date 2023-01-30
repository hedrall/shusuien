import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { LoginPage, LoginPageProps } from '@frontend/components/pages/Login/index';

describe('LoginPage', () => {
  let container: HTMLElement;

  const props: LoginPageProps = {};

  beforeAll(() => {
    const tree = render(<LoginPage {...props} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
