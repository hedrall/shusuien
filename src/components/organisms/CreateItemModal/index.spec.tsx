import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { CreateItemModal, CreateItemModalProps } from "@frontend/components/organisms/CreateItemModal/index";

describe('CreateItemModal', () => {
  
  let container: HTMLElement;
  
  const props: CreateItemModalProps = {
    
  }
  
  beforeAll(() => {
    const tree = render(<CreateItemModal {...(props)} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
