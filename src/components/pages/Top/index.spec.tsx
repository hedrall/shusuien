import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { TopPage, TopPageProps } from '@frontend/components/pages/Top/index';
import { RecoilRoot } from 'recoil';

describe('Top', () => {
  let container: HTMLElement;
  const props: TopPageProps = {};

  beforeAll(() => {
    const tree = render(
      <RecoilRoot>
        <TopPage {...props} />
      </RecoilRoot>,
    );
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
