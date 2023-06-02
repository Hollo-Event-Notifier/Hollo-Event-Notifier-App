const {Given, When, Then, After, Before} = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

Before(async function(){
  browser = await puppeteer.launch();
  page = await browser.newPage();
})


Given('the User is on the Homepage', async function () {
  await page.goto('http://localhost:4200/')
});

When('the User clicks on the {string} Button on the hungarian page', async function (buttonText) {
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
});


Given('the User is on the Homepage that is set on English language so, that someone clicked on {string} button before', async function (buttonText) {
  await page.goto('http://localhost:4200/')
  const [button] = await page.$x(`//button[contains(., '${buttonText}')]`);
  expect(button).to.exist;
  await button.click();
});

When('the User clicks on the {string} Button on the english page', async function (buttonText) {
  const [button] = await page.$x(`//button[contains(., '${buttonText}')]`);
  expect(button).to.exist;
  await button.click();
});

Then('the text on the button should change to {string} indicating, that the webpage is in Hungarian', async function (buttonText) {
  const [button] = await page.$x(`//button[contains(., '${buttonText}')]`);
  expect(button).to.exist;
});


Given('the website is operational', async function () {
  page = await browser.newPage();
});

When('the user connects to the website', async function () {
  await page.goto('http://localhost:4200/')
});

Then('the user sees by default a calendar for the actual week, with days from monday to sunday', async function () {
  const n = await page.$("div[class='fc-timeGridWeek-view fc-view fc-timegrid']")
  expect(n).to.exist;
});

Given('does not see the day view', async function () {
  const n = await page.$("div[class='fc-timeGridDay-view fc-view fc-timegrid']")
  expect(n).to.not.exist;
});

When('the User clicks on the {string} Button on the page to see the day view', async function (string) {
  const [button] = await page.$x(`//button[contains(., '${string}')]`);
  expect(button).to.exist;
  await button.click();
});

Then('the calendar should change to day view', async function () {
  const n = await page.$("div[class='fc-timeGridDay-view fc-view fc-timegrid']")
  expect(n).to.exist;
});


Given('does not see the month view', async function () {
  const n = await page.$("div[class='fc-dayGridMonth-view fc-view fc-daygrid']")
  expect(n).to.not.exist;
});

When('the User clicks on the {string} Button on the page to see the month view', async function (string) {
  const [button] = await page.$x(`//button[contains(., '${string}')]`);
  expect(button).to.exist;
  await button.click();
});

Then('the calendar should change to month view', async function () {
  const n = await page.$("div[class='fc-dayGridMonth-view fc-view fc-daygrid']")
  expect(n).to.exist;
});

Given('does not see the list view', async function () {
  const n = await page.$("div[class='fc-listWeek-view fc-view fc-list fc-list-sticky']")
  expect(n).to.not.exist;
});

When('the User clicks on the {string} Button on the page to see the list view', async function (string) {
  const [button] = await page.$x(`//button[contains(., '${string}')]`);
  expect(button).to.exist;
  await button.click();
});

Then('the calendar should change to list view', async function () {
  const n = await page.$("div[class='fc-listWeek-view fc-view fc-list fc-list-sticky']")
  expect(n).to.exist;
});


After(async function () {
  await browser.close();
})
