import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { 棚一覧表示, TanaListProps } from '@frontend/components/organisms/TanaList/index';

describe('TanaList', () => {
  let container: HTMLElement;

  const props: TanaListProps = {};

  beforeAll(() => {
    const tree = render(<棚一覧表示 {...props} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
