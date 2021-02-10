/* eslint-env jest */
import { render } from '@testing-library/react';
import { StockChart } from '../StockChart';

test ('StockChart no stocks (snapshot)', () => {
  render (
    <StockChart stocks={[]} months={12} width={600} height={400} />
  );
});
