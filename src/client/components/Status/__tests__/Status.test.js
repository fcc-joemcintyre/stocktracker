/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Status } from '../Status';

test ('Status displays default content', () => {
  const component = renderer.create (
    <Status />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Status displays 2 requests', () => {
  const component = renderer.create (
    <Status requests={['GE', 'V']} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Status displays 2 errors', () => {
  const component = renderer.create (
    <Status errors={['BCD not found', 'XYZ not found']} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Status displays 2 requests and 2 errors', () => {
  const component = renderer.create (
    <Status requests={['GE', 'V']} errors={['BCD not found', 'XYZ not found']} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});
