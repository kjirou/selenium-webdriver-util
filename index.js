var async = require('async');
var _ = require('lodash');
var webdriver = require('selenium-webdriver');


var waitForElements = function waitForElements(driverOrElement, locator, options) {
  options = _.assign({
    shouldBeDisplayed: false,
    min: 1,
    interval: 100,
    limit: 30000
  }, options || {});

  var scopeElement = driverOrElement;
  var driver = driverOrElement;
  if (driverOrElement instanceof webdriver.WebElement) {
    driver = scopeElement.getDriver();
  }

  var duration = 0;
  var dfd = webdriver.promise.defer();
  setTimeout(function() {
    var thisTask = arguments.callee;
    scopeElement
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

  return dfd.promise;
};

var waitForElement = function waitForElement(driverOrElement, locator, options) {
  return waitForElements(driverOrElement, locator, options)
    .then(function(elements) {
      return webdriver.promise.fulfilled(elements[0]);
    })
  ;
};

var filterElementsByHtml = function filterElementsByHtml(elements, keywordOrMatcher) {
  var flows = elements.map(function(element) {
    return webdriver.promise.createFlow(function() {
      return element
        .getInnerHtml()
        .then(function(html) {
          if (
            typeof keywordOrMatcher === 'string' && html.indexOf(keywordOrMatcher) !== -1 ||
            keywordOrMatcher instanceof RegExp && keywordOrMatcher.test(html)
          ) {
            return webdriver.promise.fulfilled(element);
          }
        })
      ;
    });
  });

  return webdriver.promise
    .all(flows)
    .then(function(results) {
      var cleanedResults = results.filter(function(v) { return !!v; });
      return webdriver.promise.fulfilled(cleanedResults);
    })
  ;
};

var selectOptions = function selectOptions(selectElement, label, options) {
  options = _.assign({
    max: 99999999
  }, options || {});

  return selectElement.findElements({ css: 'option' })
    .then(function(elements) {
      return filterElementsByHtml(elements, label);
    })
    .then(function(elements) {
      elements = elements.slice(0, options.max);
      return webdriver.promise.all(elements.map(function(element) {
        return element.click();
      })).then(function() {
        return webdriver.promise.fulfilled(elements);
      });
    });
  ;
};

var selectOption = function selectOption(selectElement, label) {
  return selectOptions(selectElement, label, { max: 1 })
    .then(function(elements) {
      return webdriver.promise.fulfilled(elements[0] || null);
    })
  ;
};


module.exports = {
  waitForElements: waitForElements,
  waitForElement: waitForElement,
  filterElementsByHtml: filterElementsByHtml,
  // Multi selection is not working now Ref) #1
  //selectOptions: selectOptions,
  selectOption: selectOption
};
