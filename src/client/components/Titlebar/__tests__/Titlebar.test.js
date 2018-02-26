/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Titlebar } from '../Titlebar';

test ('Titlebar displays its content', () => {
  const component = renderer.create (
    <Titlebar />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});
