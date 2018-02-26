import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Stock extends Component {
  constructor (props) {
    super (props);
    this.onRemove = this.onRemove.bind (this);
  }

  onRemove () {
    this.props.onRemoveStock (this.props.symbol);
  }

  render () {
    return (
      <div className='stockBox'>
        <div className='stockColor' style={{ backgroundColor: this.props.color }} />
        <div className='stockBody'>
          <div className='stockSymbol'>{this.props.symbol}</div>
          <div className='stockName'>{this.props.name}</div>
        </div>
        <div className='stockRemove' onClick={this.onRemove}>X</div>
      </div>
    );
  }
}

Stock.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onRemoveStock: PropTypes.func.isRequired,
};
