/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Page } from '../Page';

test ('Page starting state', () => {
  const component = renderer.create (
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
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});
