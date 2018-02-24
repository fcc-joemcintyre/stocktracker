
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import { Titlebar } from '../../src/client/components/Titlebar.jsx';

expect.extend (expectJSX);
/* eslint-disable react/jsx-filename-extension */
describe ('Titlebar', () => {
  it ('correct content', () => {
    const renderer = createRenderer ();
    renderer.render (<Titlebar />);
    const actualElement = renderer.getRenderOutput ();
    const expectedElement = (
      <div className='titleArea'>
        <div className='titleText'>
          Stock Tracker
        </div>
      </div>
    );
    expect (actualElement).toEqualJSX (expectedElement);
  });
});
