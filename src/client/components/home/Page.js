import React from 'react';
import PropTypes from 'prop-types';
import { Range } from '../range/Range';
import { StockChart } from '../stockChart/StockChart';
import { StockEntry } from '../stockEntry/StockEntry';
import { Status } from '../status/Status';
import { Stock } from '../stock/Stock';

export const Page = ({ data, months, retrieving, errors, onRangeChanged, onAddStock, onRemoveStock }) => {
  const colors = ['blue', 'green', 'lightblue', 'lightgreen', 'purple', 'orange', 'lightpurple', 'steelblue'];
  const stockData = data.map ((item, index) => ({ ...item, color: colors[index] }));

  const stocks = data.map ((item, index) => (
    <Stock
      key={item.symbol}
      symbol={item.symbol}
      name={item.name}
      color={colors[index]}
      onRemoveStock={onRemoveStock}
    />
  ));

  return (
    <>
      <div className='titlebar'>
        <h1 className='title'>StockTracker</h1>
      </div>
      <div style={{ marginTop: '4px', marginBottom: '4px' }}>
        <Range
          months={months}
          onRangeChanged={onRangeChanged}
        />
      </div>
      <StockChart
        className='stockChart'
        width={900}
        height={500}
        months={months}
        stocks={stockData}
      />
      <div style={{ display: 'flex' }}>
        { stocks }
      </div>
      { stocks.length < 8 && (
        <StockEntry onAddStock={onAddStock} />
      )}
      <Status requests={retrieving} errors={errors} />
    </>
  );
};

Page.propTypes = {
  data: PropTypes.arrayOf (PropTypes.shape ({})).isRequired,
  months: PropTypes.number.isRequired,
  retrieving: PropTypes.arrayOf (PropTypes.string).isRequired,
  errors: PropTypes.arrayOf (PropTypes.string).isRequired,
  onRangeChanged: PropTypes.func.isRequired,
  onAddStock: PropTypes.func.isRequired,
  onRemoveStock: PropTypes.func.isRequired,
};
