/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import * as mockSocket from 'mock-socket';
import { mount } from 'enzyme';
import { App } from '../App';

test ('App starting state', () => {
  const component = renderer.create (
    <App />
  );
  const tree = component.toJSON ();
  expect (tree).toMatchSnapshot ();
});

jest.mock ('socket.io-client', () => mockSocket.SocketIO);

test ('App starting state', () => {
  const mockServer = new mockSocket.Server ('ws://localhost:3999');
  mockServer.on ('connection', () => {
    mockServer.emit ('connect');
    mockServer.on ('subscribe', (data, fn) => fn ());
  });

  mount (<App />);
});
