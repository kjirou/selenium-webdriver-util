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

    it('should wait for a 1 element at a minimum', function(done) {
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
          assert.strictEqual(html, 'item-3');
        })
        .then(done, done)
      ;
    });

    it('should wait for 4 elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { min: 2 });
        })
        .then(function(elements) {
          assert.strictEqual(elements.length, 2);
        })
        .then(done, done)
      ;
    });

    it('should wait for scoped elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return driver.findElement({ id: 'container' });
        })
        .then(function(element) {
          return webdriverUtil.waitForElements(element, webdriver.By.css('ul li'), { min: 2 });
        })
        .then(function(elements) {
          assert.strictEqual(elements.length, 2);
        })
        .then(done, done)
      ;
    });

    it('should wait for hidden elements', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/show-elements-slowly.html')
        .then(function() {
          return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { shouldBeDisplayed: false });
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
          assert.strictEqual(html, 'item-3');
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

    it('should filter by keyword', function(done) {
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

    it('should filter by matcher', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/list.html')
        .then(function() {
          return driver.findElements({ css: 'ul li' });
        })
        .then(function(elements) {
          return webdriver.promise.fulfilled()
            .then(function() {
              return webdriverUtil.filterElementsByHtml(elements, /(banana|cherry|grape)/i);
            })
            .then(function(elements) {
              assert.strictEqual(elements.length, 3);
            })
          ;
        })
        .then(done, done)
      ;
    });
  });


  describe('selectOption', function() {

    it('should select a option', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/select.html')
        .then(function() {
          return driver.findElement({ id: 'single' });
        })
        .then(function(selectElement) {
          return webdriverUtil.selectOption(selectElement, 'ra');
        })
        .then(function(optionElement) {
          return optionElement.getInnerHtml();
        })
        .then(function(html) {
          assert.strictEqual(html, 'Grape', '"Grape" is selected instead of the "Orange"');
        })
        .then(done, done)
      ;
    });

    it('should not throw a error if can not find the option', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/select.html')
        .then(function() {
          return driver.findElement({ id: 'single' });
        })
        .then(function(selectElement) {
          return webdriverUtil.selectOption(selectElement, 'Tomato');
        })
        .then(function(optionElement) {
          assert.strictEqual(optionElement, null);
        })
        .then(done, done)
      ;
    });
  });

  describe('breakpoint', function() {

    it('should be', function(done) {
      driver
        .get('file://' + SUPPORT_ROOT + '/list.html')
        .then(function() {
          setTimeout(function() {
            process.stdin.emit('data', 'a');
          }, 1000);
          return webdriverUtil.breakpoint();
        })
        .then(done, done)
      ;
    });
  });
});
