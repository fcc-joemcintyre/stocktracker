import React from 'react';
import PropTypes from 'prop-types';

/*
 * Set of ranges displayed, allowing user to select one
 */
export const Range = ({ months, onRangeChanged }) => {
  const spans = [];
  for (const value of [1, 3, 6, 12, 36]) {
    spans.push (
      <span
        key={value}
        className={(value === months) ? 'selected' : ''}
        onClick={() => onRangeChanged (value)}
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
};

Range.propTypes = {
  // months in range
  months: PropTypes.number,
  // function to call on range change
  onRangeChanged: PropTypes.func.isRequired,
};

Range.defaultProps = {
  months: 12,
};
