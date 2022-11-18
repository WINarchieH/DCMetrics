const faker = require('faker');
const puppeteer = require('puppeteer');
const { jssPreset } = require('@material-ui/core');
puppeteer.launch({
    userDataDir: "./user_data"
  });

jest.setTimeout(48000000);

describe('Maintenance/TeamManager Screen', () => {
    test('Add Team Manager', async () => {
        let browser = await puppeteer.launch({
            headless: false, 
            devtools: true, 
            slowMo: 250
        });
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 

        page.emulate({
            viewport: {
                width: 1026,
                height: 900
            },
            userAgent: ''
        });

        await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 5000000 });
        await page.waitForSelector('.login-container');
        
        const inputButtons = await page.$x('//div[@class="login-form-item"]//input')
        await inputButtons[0].type('WIN');
        await inputButtons[1].type('win1');
        
        await page.evaluate(() => {
            document.querySelectorAll(".login-form-item")[2].firstElementChild.click();
        })

        await page.waitForSelector('#root');
        
        await page.goto('http://localhost:3000/Maintenance/TeamManager', { waitUntil: 'load', timeout: 5000000 });

        await page.waitForSelector('.screen-container');
        const addButton = (await page.$x('//div[contains(@class,"panel")]//button'))[2];
        await addButton.click();

        const modalInput = (await page.$x('//div[@class="modal-item"]/input'));
        await modalInput[0].type('Test Manager Name');
        await modalInput[1].type('Manager Position');

        browser.close();

  }, 48000000);

});