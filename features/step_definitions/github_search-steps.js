/*jslint node: true */
'use strict';

module.exports = function() {
  this.World = require('../support/world.js').World;

  this.Given('I am on the Cucumber.js GitHub repository', function() {
    return this.driver.get('https://github.com/cucumber/cucumber-js/tree/master');
  });

  this.When(/^I click on "([^"]*)"$/, function(text) {
    return this.driver.findElement({linkText: text}).then(function(element) {
      return element.click();
    });
  });

  this.When(/^I type "([^"]*)" on the "([^"]*)" field and press "Enter"$/, function(value, placeholder) {
    var webdriver = this.webdriver;
    var xpath = `//input[@placeholder='${placeholder}']`;
    return this.driver.findElement({xpath: xpath}).then(function(element) {
      return element.sendKeys(value).then(() => {
        return element.sendKeys(webdriver.Key.ENTER);
      });
    });
  });

  this.Then(/^I should see "([^"]*)"$/, function(text) {
    var xpath = "//*[contains(text(),'" + text + "')]";
    var condition = this.webdriver.until.elementLocated({xpath: xpath});
    return this.driver.wait(condition, 5000);
  });
};
