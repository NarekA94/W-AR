import React from 'react';
import {Cart} from '~/components';

export function withCart(InputComponent: any) {
  const Component = (props: any) => {
    return (
      <>
        <InputComponent {...props} />
        <Cart />
      </>
    );
  };
  return Component;
}
