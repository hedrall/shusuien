import React from 'react';
import { render, screen } from '@testing-library/react/pure';
import { UploadImage, UploadImageProps } from "@frontend/components/atoms/UploadImage/index";

describe('UploadImage', () => {
  
  let container: HTMLElement;
  
  const props: UploadImageProps = {
    
  }
  
  beforeAll(() => {
    const tree = render(<UploadImage {...(props)} />);
    container = tree.container;
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
