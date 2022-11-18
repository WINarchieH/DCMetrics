const faker = require('faker');
const puppeteer = require('puppeteer');
puppeteer.launch({
    userDataDir: "./user_data"
  });
  
describe('Login Form', () => {
    test('Submit Login Form', async () => {
        let browser = await puppeteer.launch({
            headless: false, 
            devtools: true, 
            slowMo: 250
        });
        let page = await browser.newPage();

        page.emulate({
            viewport: {
                width: 500,
                height: 900
            },
            userAgent: ''
        });

        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.login-container');
        await page.click('input[name=username]');
        
        const inputButtons = await page.$x('//div[@class="login-form-item"]//input')
        await inputButtons[0].type('WIN');
        await inputButtons[1].type('win1');
        
        await page.evaluate(() => {
            document.querySelectorAll(".login-form-item")[2].firstElementChild.click();
        })

        await page.waitForSelector('#root');

        browser.close();
    }, 9000000);
});