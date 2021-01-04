/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import { StockEntry } from '../StockEntry';

test ('StockEntry initial display', () => {
  const { asFragment } = render (
    <StockEntry onAddStock={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

/*
test ('Add stock event', () => {
  const onAddStock = jest.fn ();
  const component = render (<StockEntry onAddStock={onAddStock} />);

  const input = component.find ('input').first ();
  const button = component.find ('button').first ();

  input.simulate ('change', { target: { value: 'GE' } });
  button.simulate ('submit');
  expect (onAddStock).toBeCalledWith ('GE');
});
*/
