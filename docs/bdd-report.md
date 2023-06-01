## Behavior Driven Development

### Description

In our application we implemented BDD tests for the frontend component of the application (Angular).
This document provides a summary of what tools have been used and how.


### Cucumber

For BDD tests we used [Cucumber](https://cucumber.io/). Even though there is no official support for the Typescript language, we could use the JavaScript implementation of the tool.
To connect the test scenarios with the code, we needed to make step definitions.
To make proper step definitions, we had to use Chai and Puppeteer in addition to Cucumber.


### cucumber-html-reporter

Cucumber can provide a JSON report file and [cucumber-html-reporter](https://github.com/gkushang/cucumber-html-reporter#readme) can create a pretty HTML report from it.

### Chai

[Chai](https://www.chaijs.com/) is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any JavaScript testing framework.
It was used in the step definitions, mainly to test whether an HTML element exists or not.


### Puppeteer

Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. It can automatically perform most things that people do manually, like making screenshots or generating PDF files of pages.
In our tests we used it to launch and close the browser and to open webpages.

### Testing

With the help of these tools we could perform the necessary BDD tests.
To run the tests and to get a JSON report file, write ```npx cucumber-js --format json:./reports/results.json``` in the command line.
To generate a HTML file from the JSON report file, run the ```generate-report.js``` JavaScript  file with the ```npm run generate-report``` script.
![BDD test report](/docs/media/bdd-test-report.png)