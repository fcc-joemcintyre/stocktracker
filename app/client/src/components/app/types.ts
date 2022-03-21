export type Stock = {
  status: number,
  name: string,
  symbol: string,
  data: [Date, number, number, number, number, number, number,
    number, number, number, number, number, number][],
};
