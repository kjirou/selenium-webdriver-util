var assert = require('assert');
var webdriver = require('selenium-webdriver');

var webdriverUtil = require('../index');


var SUPPORT_ROOT = __dirname + '/support';


describe('selenium-webdriver-util', function() {

  var driver;

  before(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  });

  after(function(done) {
    driver.quit().then(done, done);
  });

  describe('waitForElements', function() {

    it('should wait for elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'));
        })
        .then(function(elements) {
          assert.strictEqual(elements.length, 1);
          return elements[0].getInnerHtml();
        })
        .then(function(html) {
          assert.strictEqual(html, 'item-1');
        })
        .then(done, done)
      ;
    });

    it('should wait for 4 elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { min: 4 });
        })
        .then(function(elements) {
          assert.strictEqual(elements.length, 4);
        })
        .then(done, done)
      ;
    });

    it('should wait for displayed elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { shouldBeDisplayed: true });
        })
        .then(function(elements) {
          assert.strictEqual(elements.length, 1);
          return elements[0].getInnerHtml();
        })
        .then(function(html) {
          assert.strictEqual(html, 'item-3');
        })
        .then(done, done)
      ;
    });
3
    it('should return a error', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { min: 5, limit: 10 });
        })
        .then(null, function(err) {
          assert(err.message.match('Can not'));
        })
        .then(done, done)
      ;
    });
  });
});
