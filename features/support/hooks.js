/*jslint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var open = require('open');
var reporter = require('cucumber-html-reporter');
var driver = require('./world.js').getDriver();
var cucumberReportPath = path.resolve('./reports', 'cucumber-report.json');

/*
** Transform JSON file from ns to ms
** Arg : JSON file path to modify
*/
var transformJsonFile = function(filePath) {
  const fromNstoMs = 1000000;
  if(fs.existsSync(filePath)) {
    var decodedFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	  decodedFile.forEach(function(feature) {
	    feature.elements.forEach(function(scenario) {
		    scenario.steps.forEach(function(step) {
		      step.result.duration = Math.floor(step.result.duration / fromNstoMs);
		    });
	    });
	  });
	  fs.writeFileSync(cucumberReportPath, JSON.stringify(decodedFile, null, 2), 'utf8');
  }
};

var myHooks = function() {
  // BEFORE
	this.registerHandler('BeforeScenario', function(scenario) {
		driver.manage().deleteAllCookies();
	});

  // AFTER EACH
  this.After(function(scenario) {
		return driver.takeScreenshot().then(function(screenShot) {
		  var decodedScreenShot = new Buffer(screenShot, 'base64');
		  scenario.attach(decodedScreenShot, 'image/png');
		});
	});

  // AFTER ALL
  this.registerHandler('AfterFeatures', function(scenario) {
    transformJsonFile(cucumberReportPath);
    var reportOptions = {
      theme: 'bootstrap',
      jsonFile: cucumberReportPath,
      output: path.resolve('./reports', 'cucumber-report.html'),
      reportSuiteAsScenarios: true,
      ignoreBadJsonFile: true
    };
    reporter.generate(reportOptions);
    open(reportOptions.output);
    driver.manage().deleteAllCookies();
    return driver.close().then(function() {
      return driver.quit();
    });
  });
};

module.exports = myHooks;
