'use strict';
const server = require ('../../dist/server');

describe ('test-main', function () {
  describe ('test-cmd', function () {
    require ('./test_cmd');
  });
  describe ('test-server', function () {
    require ('./test_server');
  });
});
