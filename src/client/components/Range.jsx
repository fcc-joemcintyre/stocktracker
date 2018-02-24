/**
 * Copyright (c) Joe McIntyre, 2016-2018
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Outstanding requests and error status display.
 */
export class Range extends Component {
  constructor (props) {
    super (props);
    this.state = {
      months: props.months,
    };
    this.onRangeSelected = this.onRangeSelected.bind (this);
  }

  onRangeSelected (months) {
    if (months !== this.state.months) {
      this.setState ({ months });
      this.props.onRangeChanged (months);
    }
  }

  render () {
    const spans = [];
    for (const value of [1, 3, 6, 12, 36]) {
      spans.push (
        <span
          key={value}
          className={(value === this.state.months) ? 'selected' : ''}
          onClick={() => { this.onRangeSelected (value); }}
        >
          {(value < 12) ? `${value}m` : `${(value / 12)}y`}
        </span>
      );
    }

    return (
      <div className='rangeBox'>
        {spans}
      </div>
    );
  }
}

Range.propTypes = {
  // months in range
  months: PropTypes.number,
  // function to call on range change
  onRangeChanged: PropTypes.func.isRequired,
};

Range.defaultProps = {
  months: 12,
};
