import React from 'react';
import PropTypes from 'prop-types';

export const Stock = ({ name, symbol, color, onRemoveStock }) => {
  function onRemove () {
    onRemoveStock (symbol);
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '200px',
        height: '68px',
        border: '1px solid darkgray',
        margin: '8px 8px 16px 0',
      }}
    >
      <div style={{ width: '10px', height: '100%', backgroundColor: color }} />
      <div style={{ width: '100%', height: '100%', padding: '4px' }}>
        <div style={{ fontSize: '24px' }}>{symbol}</div>
        <div style={{ fontSize: '16px' }}>{name}</div>
      </div>
      <div
        id='stock-remove'
        style={{ color: 'red', textAlign: 'center', cursor: 'pointer' }}
        onClick={onRemove}
      >
        X
      </div>
    </div>
  );
};

Stock.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onRemoveStock: PropTypes.func.isRequired,
};
