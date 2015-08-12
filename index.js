var async = require('async');
var _ = require('lodash');
var webdriver = require('selenium-webdriver');


var waitForElements = function waitForElements(driver, locator, options) {
  options = _.assign({
    shouldBeDisplayed: false,
    min: 1,
    interval: 100,
    limit: 30000
  }, options || {});

  var duration = 0;
  var dfd = webdriver.promise.defer();
  setTimeout(function() {
    var thisTask = arguments.callee;
    driver
      .findElements(locator)
      .then(function(elements) {
        if (options.shouldBeDisplayed) {
          var dfd_ = webdriver.promise.defer();
          async.filterSeries(elements, function(element, next) {
            element.isDisplayed()
              .then(function(isDisplayed) {
                next(isDisplayed);
              })
            ;
          }, function(elements) {
            dfd_.fulfill(elements);
          });
          return dfd_.promise;
        } else {
          return webdriver.promise.fulfilled(elements);
        }
      })
      .then(function(elements) {
        if (elements.length >= options.min) {
          dfd.fulfill(elements);
        } else if (duration <= options.limit) {
          duration += options.interval;
          setTimeout(thisTask, options.interval);
        } else {
          dfd.reject(new Error('Can not find elements'));
        }
      }, function(err) {
        dfd.reject(err);
      });
    ;
  }, 1);

  return new webdriver.WebElementPromise(driver, dfd.promise);
};

var waitForElement = function waitForElement(driver, locator, options) {
  return waitForElements(driver, locator, options)
    .then(function(elements) {
      return webdriver.promise.fulfilled(elements[0]);
    })
  ;
};

var filterElementsByHtml = function filterElementsByHtml(elements, keyword) {
};

var selectOptions = function selectOptions(selectElement, locator) {
};

var selectOption = function selectOption(selectElement, locator) {
};

var selectOptionsByLabel = function selectOptionsByLabel(selectElement, label) {
};

var selectOptionByLabel = function selectOptionByLabel(selectElement, label) {
};


module.exports = {
  waitForElements: waitForElements,
  waitForElement: waitForElement,
  filterElementsByHtml: filterElementsByHtml,
  selectOptions: selectOptions,
  selectOption: selectOption,
  selectOptionsByLabel: selectOptionsByLabel,
  selectOptionByLabel: selectOptionByLabel
};
