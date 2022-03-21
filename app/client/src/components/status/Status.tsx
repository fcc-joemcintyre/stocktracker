type Props = {
  requests?: string[],
  errors?: string[],
};

/*
 * Outstanding requests and error status display.
 */
export const Status = ({
  requests = [], errors = [],
}: Props) => (
  <div>
    <div>
      Pending requests: {requests.length > 0 ? requests.join (',') : 'none'}
    </div>
    <div>
      Errors: {errors.length > 0 ? errors.join (',') : 'none'}
    </div>
  </div>
);
