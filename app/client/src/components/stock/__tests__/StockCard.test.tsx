/* eslint-env jest */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StockCard } from '../StockCard';

test ('Stock displays its content', () => {
  const { asFragment } = render (
    <StockCard name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={() => { /* */ }} />
  );
  expect (asFragment).toMatchSnapshot ();
});

test ('Remove stock event', () => {
  const onRemove = jest.fn ();
  const component = render (
    <StockCard name='General Electric' symbol='GE' color='#0000ff' onRemoveStock={onRemove} />
  );

  const button = component.container.querySelector ('#stock-remove');
  expect (button).not.toBeNull ();
  if (button) {
    userEvent.click (button);
    expect (onRemove).toBeCalledWith ('GE');
  }
});
