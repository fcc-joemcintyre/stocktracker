import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Titlebar } from '../Titlebar';
import { Range } from '../Range';
import { StockChart } from '../StockChart';
import { Stock } from '../Stock';
import { StockEntry } from '../StockEntry';
import { Status } from '../Status';

export const Page = ({ data, months, retrieving, errors, chartKey, onRangeChanged, onAddStock, onRemoveStock }) => {
  const colors = ['blue', 'green', 'lightblue', 'lightgreen', 'purple', 'orange', 'lightpurple', 'steelblue'];
  const stockData = data.map ((item, index) => Object.assign ({}, item, { color: colors[index] }));
  const stocks = data.map ((item, index) => (
    <Stock
      key={item.symbol}
      symbol={item.symbol}
      name={item.name}
      color={colors[index]}
      onRemoveStock={onRemoveStock}
    />
  ));

  // if not all tracking slots (8) are taken, show entry component
  const stockEntry = (stocks.length < 8) ? <StockEntry onAddStock={onAddStock} /> : null;

  return (
    <Fragment>
      <Titlebar />
      <Range months={months} onRangeChanged={onRangeChanged} />
      <StockChart
        key={chartKey}
        className='stockChart'
        width={900}
        height={500}
        months={months}
        stocks={stockData}
      />
      <div className='stockArea'>
        {stocks}
        {stockEntry}
      </div>
      <Status requests={retrieving} errors={errors} />
    </Fragment>
  );
};

Page.propTypes = {
  data: PropTypes.arrayOf (PropTypes.shape ({})).isRequired,
  months: PropTypes.number.isRequired,
  retrieving: PropTypes.arrayOf (PropTypes.string).isRequired,
  errors: PropTypes.arrayOf (PropTypes.string).isRequired,
  chartKey: PropTypes.number.isRequired,
  onRangeChanged: PropTypes.func.isRequired,
  onAddStock: PropTypes.func.isRequired,
  onRemoveStock: PropTypes.func.isRequired,
};
