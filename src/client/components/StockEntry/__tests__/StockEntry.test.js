/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { StockEntry } from '../StockEntry';

test ('StockEntry initial display', () => {
  const component = renderer.create (
    <StockEntry onAddStock={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Add stock event', () => {
  const onAddStock = jest.fn ();
  const component = mount (<StockEntry onAddStock={onAddStock} />);
  expect (component.props ().onAddStock).toBeDefined ();

  const input = component.find ('input').first ();
  const button = component.find ('button').first ();
  expect (input).toBeDefined ();
  expect (button).toBeDefined ();

  input.simulate ('change', { target: { value: 'GE' } });
  button.simulate ('submit');
  expect (onAddStock).toBeCalledWith ('GE');
});
