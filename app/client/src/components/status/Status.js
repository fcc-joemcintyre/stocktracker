import PropTypes from 'prop-types';

/*
 * Outstanding requests and error status display.
 */
export const Status = ({ requests, errors }) => (
  <div>
    <div>
      Pending requests: {requests.length > 0 ? requests.join (',') : 'none'}
    </div>
    <div>
      Errors: {errors.length > 0 ? errors.join (',') : 'none'}
    </div>
  </div>
);

Status.propTypes = {
  // stock symbols of outstanding requests
  requests: PropTypes.arrayOf (PropTypes.string),
  // errors in format [Stock: symbol Error:# (message)]
  errors: PropTypes.arrayOf (PropTypes.string),
};

Status.defaultProps = {
  requests: [],
  errors: [],
};
