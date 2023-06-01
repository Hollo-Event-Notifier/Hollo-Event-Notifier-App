const reporter = require('cucumber-html-reporter');
const options = {
  theme: 'bootstrap',
  jsonFile: './reports/results.json',
  output: './reports/results.html',
  reportSuiteAsScenarios: true,
  launchReport: false
};

reporter.generate(options);
