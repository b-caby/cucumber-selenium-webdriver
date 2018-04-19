/*jslint node: true */
'use strict';

require('chromedriver');
const fs = require('fs');
const webdriver = require('selenium-webdriver');

var buildChromeDriver = function() {
  return new webdriver.Builder().
    withCapabilities({
      browserName: 'chrome',
      javascriptEnabled: true,
      acceptSslCerts: true
    }).build();
};

var driver = buildChromeDriver();

var getDriver = function() {
  return driver;
};

var World = function World() {

  var defaultTimeout = 20000;

  this.webdriver = webdriver;
  this.driver = driver;
};

module.exports.World = World;
module.exports.getDriver = getDriver;
