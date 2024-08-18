const { Builder, By, Key, until } = require('selenium-webdriver');

const RETRY_COUNT = 3; // Number of retry attempts
const TIMEOUT = 10000; // 10 seconds timeout

async function waitForElement(driver, locator, timeout = TIMEOUT) {
    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
        try {
            let element = await driver.wait(until.elementLocated(locator), timeout);
            await driver.wait(until.elementIsVisible(element), timeout);
            return element;
        } catch (error) {
            if (attempt === RETRY_COUNT) {
                throw new Error(`Element with locator ${locator} could not be found or is not visible after ${RETRY_COUNT} attempts`);
            }
            console.log(`Attempt ${attempt} failed. Retrying...`);
        }
    }
}

async function runTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.youtube.com');

        // Wait for the search box to be visible
        let searchBox = await waitForElement(driver, By.xpath("//input[@id='search']"));
        await searchBox.sendKeys('Faith Church Akoka', Key.RETURN);

        // Wait for the channel name element to be visible
        let faithChurch = await waitForElement(driver, By.xpath("//ytd-channel-name[@id='channel-title']//yt-formatted-string[@id='text']"));
        await faithChurch.click();

        // Wait for the "Videos" tab to be visible
        let videos = await waitForElement(driver, By.xpath("//div[@class='yt-tab-shape-wiz__tab'][normalize-space()='Videos']"));
        await videos.click();

        // Wait for the "Live" tab to be visible
        let live = await waitForElement(driver, By.xpath("//div[@class='yt-tab-shape-wiz__tab yt-tab-shape-wiz__tab--tab-selected']"));
        await live.click();

    } finally {
        // Quit the browser
        await driver.quit();
    }
}

runTest();
