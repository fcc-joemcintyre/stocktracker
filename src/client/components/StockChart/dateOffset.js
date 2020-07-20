/**
 * Calculate a date in the past by a number of months.
 * @param {Date} date Starting date
 * @param {number} monthsAgo Number of months to go back
 * @return {Date} Date provided minus number of months
 */
export function dateOffset (date, monthsAgo) {
  if (monthsAgo === 0) {
    return date;
  }

  let year = date.getFullYear () - Math.floor (monthsAgo / 12);
  let month = date.getMonth () - (monthsAgo % 12);
  if (month < 0) {
    year -= 1;
    month += 12;
  }

  // adjust day to fall in prior month (e.g. March 31 > Feb 28/29)
  let day = date.getDate () + 1;
  let result = new Date (year, month, day);
  while (result.getMonth () !== month) {
    day -= 1;
    result = new Date (year, month, day);
  }

  return (result);
}
