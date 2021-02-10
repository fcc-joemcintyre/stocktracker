/* eslint-env jest */
import { render } from '@testing-library/react';
import { Range } from '../Range';

test ('Range has default selection (1yr)', () => {
  const { asFragment } = render (
    <Range onRangeChanged={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Range has set selection (3m)', () => {
  const { asFragment } = render (
    <Range months={3} onRangeChanged={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Range has minimum selection (1m)', () => {
  const { asFragment } = render (
    <Range months={1} onRangeChanged={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Range has minimum selection (36m)', () => {
  const { asFragment } = render (
    <Range months={36} onRangeChanged={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});
