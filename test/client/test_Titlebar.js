'use strict';
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import Titlebar from '../../src/client/components/Titlebar.jsx';

describe ('Titlebar', () => {
  it ('correct content', () => {
    let renderer = createRenderer ();
    renderer.render (<Titlebar/>);
    let actualElement = renderer.getRenderOutput ();
    let expectedElement =
      <div className='titleArea'>
        <div className='titleText'>
          Stock Tracker
        </div>
      </div>;
    expect (actualElement).toEqualJSX (expectedElement);
  });
});
