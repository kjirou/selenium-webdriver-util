# selenium-webdriver-util

[![npm version](https://badge.fury.io/js/selenium-webdriver-util.svg)](http://badge.fury.io/js/selenium-webdriver-util)
[![Circle CI](https://circleci.com/gh/kjirou/selenium-webdriver-util.svg?style=svg)](https://circleci.com/gh/kjirou/selenium-webdriver-util)

A loosely coupled utilities for [selenium-webdriver](https://code.google.com/p/selenium/wiki/WebDriverJs)


## Installation

```
npm install --save-dev selenium-webdriver-util
```


## Overview

This module is utilities for selenium-webdriver.

It has the following static functions.

- `waitForElements`
  - Wait to find expected elements
- `waitForElement`
  - Wait to find a expected element
- `filterElementsByHtml`
  - Filter elements by keyword or RegExp matcher
- `selectOption`
  - Select a option tag from a select tag
- `breakpoint`
  - To stop running tests until receive a key from the terminal

Please refer function's comment too!


## Examples

`waitForElements`:

```
var webdriver = require('selenium-webdriver');
var webdriverUtil = require('selenium-webdriver-util');

driver
  .get('http://foobarbaz.qux/')
  .then(function() {
    return webdriverUtil.waitForElements(driver, webdriver.By.css('ul li'), { min: 2 });
  })
  .then(function(elements) {
    // Run here after finding 2 or more 'ul li' elements
  })
;
```

`filterElementsByHtml`:

```
var webdriver = require('selenium-webdriver');
var webdriverUtil = require('selenium-webdriver-util');

driver
  .get('http://foobarbaz.qux/')
  .then(function() {
    //
    // <ul>
    //   <li>Apple</li>
    //   <li>Grape</li>
    //   <li>Orange</li>
    // </ul>
    //
    return driver.findElements(webdriver.By.css('ul li'));
  })
  .then(function(elements) {
    return webdriverUtil.filterElementsByHtml(elements, 'ra');
  })
  .then(function(elements) {
    // Find "Grape" and "Orange" elements
  })
;
```

`selectOption`:

```
var webdriver = require('selenium-webdriver');
var webdriverUtil = require('selenium-webdriver-util');

driver
  .get('http://foobarbaz.qux/')
  .then(function() {
    //
    // <select>
    //   <option>Apple</option>
    //   <option>Grape</option>
    //   <option>Orange</option>
    // </select>
    //
    return driver.findElement(webdriver.By.css('select'));
  })
  .then(function(element) {
    return webdriverUtil.selectOption(element, 'Grape');
  })
  .then(function(element) {
    // Select a "Grape" option, and it returns the selected option element
  })
;
```
