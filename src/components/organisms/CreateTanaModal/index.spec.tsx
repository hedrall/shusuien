import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { 棚を作成モーダルProps, 棚を作成モーダル } from '@frontend/components/organisms/CreateTanaModal/index';

describe('Modal', () => {
  let container: HTMLElement;

  const props: 棚を作成モーダルProps = {};

  beforeAll(() => {
    const tree = render(<棚を作成モーダル {...props} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
