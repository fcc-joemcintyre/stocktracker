/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
"use strict";
const assert = require ("assert");
const util = require ("../../src/client/components/util");

describe ("Test calculate date", function () {
  describe ("no offset", function () {
    it ("should be same date", function () {
      let testDate = new Date (2016, 1, 10);
      let date = util.dateOffset (testDate, 0);
      assert.deepStrictEqual (date, testDate);
    });
  });

  describe ("1 month ago (middle day)", function () {
    it ("should be correct date", function () {
      let testDate = new Date (2016, 1, 10);
      let date = util.dateOffset (testDate, 1);
      assert.deepStrictEqual (date, new Date (2015, 12, 11));
    });
  });

  describe ("1 month ago (past end day, leap year)", function () {
    it ("should be correct date", function () {
      let testDate = new Date (2016, 2, 31);
      let date = util.dateOffset (testDate, 1);
      assert.deepStrictEqual (date, new Date (2016, 1, 29));
    });
  });

  describe ("1 month ago (past end day, not leap year)", function () {
    it ("should be correct date", function () {
      let testDate = new Date (2015, 2, 31);
      let date = util.dateOffset (testDate, 1);
      assert.deepStrictEqual (date, new Date (2015, 1, 28));
    });
  });
});
