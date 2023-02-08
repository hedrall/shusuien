import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { ItemList, ItemListProps } from "@frontend/components/molecules/ItemList/index";

describe('ItemList', () => {
  
  let container: HTMLElement;
  
  const props: ItemListProps = {
    
  }
  
  beforeAll(() => {
    const tree = render(<ItemList {...(props)} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
