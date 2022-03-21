import { useState } from 'react';

type Props = {
  onAddStock: (symbol: string) => void,
};

export const StockEntry = ({
  onAddStock,
}: Props) => {
  const [symbol, setSymbol] = useState ('');

  function onChange (e) {
    setSymbol (e.target.value);
  }

  function onSubmit (e) {
    e.preventDefault ();
    const t = symbol.trim ().toUpperCase ();
    onAddStock (t);
    setSymbol ('');
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='symbolText'>Symbol:</label>
      {' '}
      <input
        type='text'
        id='symbolText'
        value={symbol}
        style={{ width: '60px' }}
        onChange={onChange}
      />
      {' '}
      <button
        type='submit'
        disabled={(symbol.trim () === '')}
      >
        Track
      </button>
    </form>
  );
};
