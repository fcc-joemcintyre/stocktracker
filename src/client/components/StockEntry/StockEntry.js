import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class StockEntry extends Component {
  constructor (props) {
    super (props);
    this.state = {
      symbol: '',
    };
    this.onChange = this.onChange.bind (this);
    this.onSubmit = this.onSubmit.bind (this);
  }

  onChange (event) {
    this.setState ({ symbol: event.target.value });
  }

  onSubmit (event) {
    event.preventDefault ();
    const symbol = this.state.symbol.trim ().toUpperCase ();
    this.props.onAddStock (symbol);
    this.setState ({ symbol: '' });
  }

  render () {
    return (
      <form className='entryBox' onSubmit={this.onSubmit}>
        <label htmlFor='symbolText'>Symbol:</label>
        <input type='text' id='symbolText' className='entryText' value={this.state.symbol} onChange={this.onChange} />
        <button
          type='submit'
          className='entryButton'
          disabled={(this.state.symbol === '')}
        >
          Track
        </button>
      </form>
    );
  }
}

StockEntry.propTypes = {
  onAddStock: PropTypes.func.isRequired,
};
