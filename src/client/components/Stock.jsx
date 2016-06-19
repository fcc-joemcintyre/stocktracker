/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React from 'react';

export default class Stock extends React.Component {
  constructor (props) {
    super (props);
    this.onRemove = this.onRemove.bind (this);
  }

  onRemove () {
    console.log ('onRemove', this.props.symbol);
    this.props.removeStock (this.props.symbol);
  }

  render() {
    return (
      <div className='stockBox'>
        <div className='stockColor' style={{backgroundColor:this.props.color}}></div>
        <div className='stockBody'>
          <div className='stockSymbol'>{this.props.symbol}</div>
          <div className='stockName'>{this.props.name}</div>
        </div>
        <div className='stockRemove' onClick={this.onRemove}>X</div>
      </div>
    );
  }
}
