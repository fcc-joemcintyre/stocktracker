/* eslint-env jest */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stock } from '../Stock';

test ('Stock displays its content', () => {
  const { asFragment } = render (
    <Stock name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Remove stock event', () => {
  const onRemove = jest.fn ();
  const component = render (
    <Stock name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={onRemove} />
  );

  const button = component.container.querySelector ('#stock-remove');
  userEvent.click (button);
  expect (onRemove).toBeCalledWith ('GE');
});
