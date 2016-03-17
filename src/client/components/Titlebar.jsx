/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React from "react";

/**
 * Simple titlebar
 */
export default class Titlebar extends React.Component {
  render() {
    return (
      <div className="titleArea">
        <div className="titleText">Stock Tracker</div>
      </div>
    );
  }
}
