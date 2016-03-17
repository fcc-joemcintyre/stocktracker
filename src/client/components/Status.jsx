/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React from "react";

/**
 * Outstanding requests and error status display.
 */
export default class Status extends React.Component {
  constructor (props) {
    super (props);
  }

  render() {
    return (
      <div className="statusBox">
        <div>
          Pending requests: {this.props.requests.length > 0
              ? this.props.requests.join (",")
              : "none"}
        </div>
        <div>Errors: {this.props.errors.length > 0
            ? this.props.errors.join (",")
            : "none"}
        </div>
      </div>
    );
  }
}

Status.propTypes = {
  // stock symbols of outstanding requests
  requests: React.PropTypes.arrayOf (React.PropTypes.string),
  // errors in format [Stock: symbol Error:# (message)]
  errors: React.PropTypes.arrayOf (React.PropTypes.string)
}

Status.defaultProps = {
  requests: [],
  errors:[]
}
