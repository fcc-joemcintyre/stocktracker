/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { StockChart } from '../StockChart';

test ('StockChart no stocks (snapshot)', () => {
  const component = renderer.create (
    <StockChart stocks={[]} months={12} width={600} height={400} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});
