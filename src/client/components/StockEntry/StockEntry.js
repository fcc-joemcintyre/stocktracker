import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const StockEntry = ({ onAddStock }) => {
  const [symbol, setSymbol] = useState ('');

  function onChange (e) {
    setSymbol (e.target.value);
  }

  function onSubmit (e) {
    e.preventDefault ();
    const t = symbol.trim ().toUpperCase ();
    onAddStock (t);
    setSymbol ('');
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='symbolText'>Symbol:</label>
      {' '}
      <input
        type='text'
        id='symbolText'
        value={symbol}
        style={{ width: '60px' }}
        onChange={onChange}
      />
      {' '}
      <button
        type='submit'
        disabled={(symbol.trim () === '')}
      >
        Track
      </button>
    </form>
  );
};

StockEntry.propTypes = {
  onAddStock: PropTypes.func.isRequired,
};
