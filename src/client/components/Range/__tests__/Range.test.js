/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Range } from '../Range';

test ('Range has default selection (1yr)', () => {
  const component = renderer.create (
    <Range onRangeChanged={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Range has set selection (3m)', () => {
  const component = renderer.create (
    <Range months={3} onRangeChanged={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Range has minimum selection (1m)', () => {
  const component = renderer.create (
    <Range months={1} onRangeChanged={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Range has minimum selection (36m)', () => {
  const component = renderer.create (
    <Range months={36} onRangeChanged={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});
