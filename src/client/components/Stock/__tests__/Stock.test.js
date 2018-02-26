/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { Stock } from '../Stock';

test ('Stock displays its content', () => {
  const component = renderer.create (
    <Stock name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={() => { /* */ }} />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

test ('Remove stock event', () => {
  const onRemove = jest.fn ();
  const component = mount (
    <Stock name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={onRemove} />
  );
  expect (component.props ().onRemoveStock).toBeDefined ();

  const button = component.find ('.stockRemove').first ();
  expect (button).toBeDefined ();

  button.simulate ('click');
  expect (onRemove).toBeCalledWith ('GE');
});
