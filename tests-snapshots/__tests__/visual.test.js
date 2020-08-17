const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('Visual Regression Testing', () => {
    let browser;
    let page;

    // Will be ran before any tests
    beforeAll(async function(){
        browser = await puppeteer.launch({
            headless: true,
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

    test('Full Page Snapshot', async function(){
        await page.goto('http://www.example.com');
        await page.waitForSelector('h1');
        // Will capture a screenshot and save to folder
        // When the test is re-run the images must match to pass
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        });
    });
    
    test('Single Element Snapshot', async function(){
        await page.goto('http://www.example.com');
        const h1 = await page.waitForSelector('h1');
        const image = await h1.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        });
    });

    test('Mobile Snapshot', async function(){
        await page.goto('http://www.example.com');
        await page.waitForSelector('h1');
        await page.emulate(puppeteer.devices['iPhone X']);
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.02
        });
    });

    test('Tablet Snapshot', async function(){
        await page.goto('http://www.example.com');
        await page.waitForSelector('h1');
        await page.emulate(puppeteer.devices['iPad landscape']);
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        });
    });

    // Removes dynamic content from a site which may cause tests
    // to become unstable
    test('Remove Element before Snapshot', async function(){
        await page.goto('http://www.example.com');
        await page.evaluate(() => {
            ;(document.querySelectorAll('h1') || []).forEach(el => el.remove())
        });
        await page.waitFor(5000);
    });

});
