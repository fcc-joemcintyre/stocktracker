/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Page } from '../Page';

test ('Page starting state', () => {
  render (
    <Page
      data={[]}
      months={3}
      retrieving={[]}
      errors={[]}
      chartKey={0}
      onRangeChanged={jest.fn ()}
      onAddStock={jest.fn ()}
      onRemoveStock={jest.fn ()}
    />
  );
  expect (screen.getByRole ('heading')).toBeDefined ();
  expect (screen.getByRole ('heading')).toHaveTextContent ('StockTracker');
});
