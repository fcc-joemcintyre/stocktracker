/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React from "react";

export default class StockEntry extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      symbol: ""
    }
    this.onChange = this.onChange.bind (this);
    this.onSubmit = this.onSubmit.bind (this);
  }

  onChange (event) {
    this.setState ({symbol:event.target.value});
  }

  onSubmit (event) {
    event.preventDefault ();
    let symbol = this.state.symbol.trim ().toUpperCase ();
    this.props.addStock (symbol);
    this.setState ({symbol: ""});
  }

  render() {
    return (
      <form className="entryBox" onSubmit={this.onSubmit}>
        <label id="symbolText">Symbol:</label>
        <input type="text" id="symbolText" className="entryText" value={this.state.symbol} onChange={this.onChange}/>
        <input type="submit" className="entryButton"
          disabled={(this.state.symbol === "")}
          value="Track"/>
      </form>
    );
  }
}
