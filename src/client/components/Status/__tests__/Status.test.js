/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import { Status } from '../Status';

test ('Status displays default content', () => {
  const { asFragment } = render (
    <Status />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Status displays 2 requests', () => {
  const { asFragment } = render (
    <Status requests={['GE', 'V']} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Status displays 2 errors', () => {
  const { asFragment } = render (
    <Status errors={['BCD not found', 'XYZ not found']} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Status displays 2 requests and 2 errors', () => {
  const { asFragment } = render (
    <Status requests={['GE', 'V']} errors={['BCD not found', 'XYZ not found']} />
  );
  expect (asFragment).toMatchSnapshot ();
});
