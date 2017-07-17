/*jslint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var open = require('open');
var reporter = require('cucumber-html-reporter');
// Import driver information
var driver = require('./world.js').getDriver();
// Get ReportPath
var cucumberReportPath = path.resolve('./reports', 'cucumber-report.json');

/*
** Transform JSON file from ns to ms
** Arg : JSON file path to modify
*/
var transformJsonFile = function(filePath) {
  const fromNstoMs = 1000000;
  if(fs.existsSync(filePath)) {
    var decodedFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	// For each features
	decodedFile.forEach(function(feature) {
	  // For each scenarios
	  feature.elements.forEach(function(scenario) {
		// For each steps
		scenario.steps.forEach(function(step) {
		  step.result.duration = Math.floor(step.result.duration / fromNstoMs);
		});
	  });
	});
	fs.writeFileSync(cucumberReportPath, JSON.stringify(decodedFile, null, 2), 'utf8');
  }
};

var myHooks = function() {

/*
** Before Scenario - Delete all cookies to start a fresh web navigation
*/
	this.registerHandler('BeforeScenario', function(scenario) {
		driver.manage().deleteAllCookies();
	});

/*
** Tags management
*/
  this.Before({tags: ['@compteClient']}, function() {
    page = page.pageObjectsCompteClient;
  });
  this.Before({tags: ['@compagnons']}, function() {
    page = page.pageObjectsCompagnons;
  });

/*
** After Features - Generate the HTML report
*/
	this.registerHandler('AfterFeatures', function(scenario) {
		// Transform from ns to ms
		transformJsonFile(cucumberReportPath);
		var reportOptions = {
		  theme: 'bootstrap',
		  jsonFile: cucumberReportPath,
		  output: path.resolve('./reports', 'cucumber-report.html'),
		  reportSuiteAsScenarios: true,
		  ignoreBadJsonFile: true
		};
		reporter.generate(reportOptions);
		// Open report file
		open(reportOptions.output);
		// Close everything
		driver.manage().deleteAllCookies();
		return driver.close().then(function() {
		  return driver.quit();
		});
	});

/*
** After Each 
**   Attach screenshot
**   Close everything
*/
	this.After(function(scenario) {
		return driver.takeScreenshot().then(function(screenShot) {
		  var decodedScreenShot = new Buffer(screenShot, 'base64');
		  scenario.attach(decodedScreenShot, 'image/png');
		});
	});
};

module.exports = myHooks;
