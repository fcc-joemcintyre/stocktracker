/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
"use strict";

/**
 * Calculate a date in the past by a number of months.
 * @param date Starting date
 * @param monthsAgo Number of months to go back
 * @return Date provided minus number of months
 */
function dateOffset (date, monthsAgo) {
  if (monthsAgo === 0) {
    return date;
  }

  let year = date.getFullYear () - Math.floor (monthsAgo / 12);
  let month = date.getMonth () - (monthsAgo % 12);
  if (month < 0) {
    year --;
    month += 12;
  }

  // adjust day to fall in prior month (e.g. March 31 > Feb 28/29)
  let day = date.getDate () + 1;
  let result = new Date (year, month, day);
  while (result.getMonth () !== month) {
    day --;
    result = new Date (year, month, day);
  }

  return (result);
}

exports.dateOffset = dateOffset;
