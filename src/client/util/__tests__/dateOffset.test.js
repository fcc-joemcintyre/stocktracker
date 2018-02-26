/* eslint-env jest */
const { dateOffset } = require ('../dateOffset');

test ('no offset should be same date', () => {
  const testDate = new Date (2016, 1, 10);
  const date = dateOffset (testDate, 0);
  expect (date).toEqual (testDate);
});

test ('1 month ago (middle day)', () => {
  const testDate = new Date (2016, 1, 10);
  const date = dateOffset (testDate, 1);
  expect (date).toEqual (new Date (2015, 12, 11));
});

test ('1 month ago (past end day, leap year)', () => {
  const testDate = new Date (2016, 2, 31);
  const date = dateOffset (testDate, 1);
  expect (date).toEqual (new Date (2016, 1, 29));
});

test ('1 month ago (past end day, not leap year)', () => {
  const testDate = new Date (2015, 2, 31);
  const date = dateOffset (testDate, 1);
  expect (date).toEqual (new Date (2015, 1, 28));
});

test ('6 months ago (prior year)', () => {
  const testDate = new Date (2015, 2, 31);
  const date = dateOffset (testDate, 6);
  expect (date).toEqual (new Date (2014, 8, 30));
});
