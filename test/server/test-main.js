/* eslint-disable global-require */
describe ('test-main', function () {
  describe ('test-cmd', function () {
    require ('./test_cmd');
  });
  describe ('test-server', function () {
    require ('./test_server');
  });
});
