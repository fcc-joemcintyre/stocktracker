'use strict';
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import Range from '../../src/client/components/Range.jsx';

describe ('Range', () => {
  describe ('Default selection', () => {
    it ('should have default selection (1y)', () => {
      let renderer = createRenderer ();
      renderer.render (<Range onRangeChanged={() => {}}/>);
      let actualElement = renderer.getRenderOutput ();
      let expectedElement =
        <div className='rangeBox'>
          <span key='1' className='' onClick={() => {}}>1m</span>
          <span key='3' className='' onClick={() => {}}>3m</span>
          <span key='6' className='' onClick={() => {}}>6m</span>
          <span key='12' className='selected' onClick={() => {}}>1y</span>
          <span key='36' className='' onClick={() => {}}>3y</span>
        </div>;
      expect (actualElement).toEqualJSX (expectedElement);
    });
  });

  describe ('Set selection', () => {
    it ('should have set selection (3m)', () => {
      let renderer = createRenderer ();
      renderer.render (<Range months={3} onRangeChanged={() => {}}/>);
      let actualElement = renderer.getRenderOutput ();
      let expectedElement =
        <div className='rangeBox'>
          <span key='1' className='' onClick={() => {}}>1m</span>
          <span key='3' className='selected' onClick={() => {}}>3m</span>
          <span key='6' className='' onClick={() => {}}>6m</span>
          <span key='12' className='' onClick={() => {}}>1y</span>
          <span key='36' className='' onClick={() => {}}>3y</span>
        </div>;
      expect (actualElement).toEqualJSX (expectedElement);
    });
  });
});
