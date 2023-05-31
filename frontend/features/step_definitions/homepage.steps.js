const {Given, When, Then} = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');


Given('the User is on the Homepage', async function () {
  browser = await puppeteer.launch();
  page = await browser.newPage();

  await page.goto('http://localhost:4200/')
});

When('the User clicks on the {string} Button', async function (buttonText) {
  const [button] = await page.$x(`//button[contains(., '${buttonText}')]`);
  if (button) {
    await button.click();
  }else{
    return 'pending';
  }
});


Then('the text on the button should change to {string} indicating, that the webpage is in English', async function (buttonText) {
  const [button] = await page.$x(`//button[contains(., '${buttonText}')]`);
  expect(button).to.exist;
  await browser.close();
});

