## Behavior Driven Development

### Description

In our application we implemented BDD tests for the frontend component of the application (Angular).

This document provides a brief summary of what tools have been used and how.

### Cucumber

For BDD tests we used [Cucumber](https://cucumber.io/). Even though there is no official supprort for the Typescript language, we could use the Javascript implementation of the tool.
To connect the test scenarios with the code, we need to make step definitions. 
To be able to make proper step definitions, we had to use Chai and Puppeteer in addition to Cucumber.

### Chai

[Chai](https://www.chaijs.com/) is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.

### Puppeteer

Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. It can automatically perform most things that people do manually, like making screenshots or generaing PDF files of pages.
In our tests we used it to launch the browser.