const puppeteer = require('puppeteer');
const { percySnapshot } = require('@percy/puppeteer');

describe('Percy Visual Test', () => {
    let browser;
    let page;

    // Will be ran before any tests
    beforeAll(async function(){
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 0,
            devtools: false,
            // defaultViewport: null,
            // args: ['--start-maximized']
        });

        page = await browser.newPage();
    });

    afterAll(async function() {
        await browser.close();
    });

    test('Full Page Percy Snapshot', async () => {
        await page.goto('http://www.example.com');
        await page.evaluate(() => {
            ;(document.querySelectorAll('h1') || []).forEach(el => el.remove())
        });
        await page.waitFor(1000);
        await percySnapshot(page, 'Example Page');
    });
    
});
