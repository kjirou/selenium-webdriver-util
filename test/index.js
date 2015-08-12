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

    it('should return a error if can not find elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { min: 5, limit: 10 });
        })
        .then(function() {
          throw new Error('Not be through here');
        }, function(err) {
          assert(/Can not find/.test(err.message));
        })
        .then(done, done)
      ;
    });
  });


  describe('waitForElement', function() {

    it('should find a element', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElement(driver, webdriver.By.css('ul li'));
        })
        .then(function(element) {
          return element.getInnerHtml();
        })
        .then(function(html) {
          assert.strictEqual(html, 'item-1');
        })
        .then(done, done)
      ;
    });

    it('should return a error if can not find element', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElement(driver, webdriver.By.css('ul li.not_existing'), { limit: 2000 });
        })
        .then(function() {
          throw new Error('Not be through here');
        }, function(err) {
          assert(/Can not find/.test(err.message));
        })
        .then(done, done)
      ;
    });
  });


  describe('filterElementsByHtml', function() {

    it('should be', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/list.html')
        .then(function() {
          return driver.findElements({ css: 'ul li' });
        })
        .then(function(elements) {
          return webdriver.promise.fulfilled()
            .then(function() {
              return webdriverUtil.filterElementsByHtml(elements, 'ra');
            })
            .then(function(elements) {
              assert.strictEqual(elements.length, 2);
            })
            .then(function() {
              return webdriverUtil.filterElementsByHtml(elements, 'anana');
            })
            .then(function(elements) {
              assert.strictEqual(elements.length, 1);
            })
            .then(function() {
              return webdriverUtil.filterElementsByHtml(elements, 'Tomato');
            })
            .then(function(elements) {
              assert.strictEqual(elements.length, 0);
            })
          ;
        })
        .then(done, done)
      ;
    });
  });
});
