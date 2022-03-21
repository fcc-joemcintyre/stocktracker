type ItemProps = {
  months: number,
  selected: boolean,
  text: string,
  onRangeChanged: (months: number) => void,
};

const Item = ({
  months, selected, text, onRangeChanged,
}: ItemProps) => (
  <div
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      color: '#ffffff',
      backgroundColor: selected ? 'teal' : 'blue',
      borderLeft: months > 1 ? '1px solid #ffffff' : undefined,
    }}
    onClick={() => onRangeChanged (months)}
  >
    {text}
  </div>
);

type RangeProps = {
  months?: number,
  onRangeChanged: (months: number) => void,
};

/*
 * Set of ranges displayed, allowing user to select one
 */
export const Range = ({
  months = 12, onRangeChanged,
}: RangeProps) => (
  <div style={{ display: 'flex' }}>
    <div style={{ border: '1px solid #7f7f7f', borderRadius: '8px', overflow: 'hidden' }}>
      <Item months={1} selected={months === 1} text='1m' onRangeChanged={onRangeChanged} />
      <Item months={3} selected={months === 3} text='3m' onRangeChanged={onRangeChanged} />
      <Item months={6} selected={months === 6} text='6m' onRangeChanged={onRangeChanged} />
      <Item months={12} selected={months === 12} text='1y' onRangeChanged={onRangeChanged} />
      <Item months={36} selected={months === 36} text='3y' onRangeChanged={onRangeChanged} />
    </div>
    <div style={{ flex: '1 1 0' }} />
  </div>
);
