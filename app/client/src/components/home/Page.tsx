import { Range } from '../range/Range';
import { StockChart } from '../stockChart/StockChart';
import { StockEntry } from '../stockEntry/StockEntry';
import { Status } from '../status/Status';
import { StockCard } from '../stock/StockCard';
import { Stock } from '../app/types.js';

type Props = {
  data: Stock[],
  months: number,
  retrieving: string[],
  errors: string[],
  onRangeChanged: (months: number) => void,
  onAddStock: (symbol: string) => void,
  onRemoveStock: (symbol: string) => void,
};

export const Page = ({
  data, months, retrieving, errors, onRangeChanged, onAddStock, onRemoveStock,
}: Props) => {
  const colors = ['blue', 'green', 'lightblue', 'lightgreen', 'purple', 'orange', 'lightpurple', 'steelblue'];
  const stockData = data.map ((item, index) => ({ ...item, color: colors[index] }));

  const stocks = data.map ((item, index) => (
    <StockCard
      key={item.symbol}
      symbol={item.symbol}
      name={item.name}
      color={colors[index]}
      onRemoveStock={onRemoveStock}
    />
  ));

  return (
    <>
      <div className='titlebar'>
        <h1 className='title'>StockTracker</h1>
      </div>
      <div style={{ marginTop: '4px', marginBottom: '4px' }}>
        <Range
          months={months}
          onRangeChanged={onRangeChanged}
        />
      </div>
      <StockChart
        width={900}
        height={500}
        months={months}
        stocks={stockData}
      />
      <div style={{ display: 'flex' }}>
        { stocks }
      </div>
      { stocks.length < 8 && (
        <StockEntry onAddStock={onAddStock} />
      )}
      <Status requests={retrieving} errors={errors} />
    </>
  );
};
