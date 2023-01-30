import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import {
  PasswordInput,
  PasswordInputProps,
} from '@frontend/components/atoms/PasswordInput/index';

describe('PasswordInput', () => {
  let container: HTMLElement;

  const props: PasswordInputProps<any, any> = {} as any;

  beforeAll(() => {
    const tree = render(<PasswordInput {...props} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
