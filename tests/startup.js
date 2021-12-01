// tests wether extension loads successfully
const { assert } = require('console');
const puppeteer = require('puppeteer');


(async () => {
    const pathToExtension = require('path').resolve(__dirname, '../src');
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });
    const dummyPage = await browser.newPage();

    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
        return  _targetInfo.type === 'service_worker';
    });
    console.assert(extensionTarget,"extension failed to innitialize");
    //gets the extension ID of the target
    const [,,extensionID,] = extensionTarget._targetInfo.url.split('/');
    const settings = await browser.newPage(); 
    await settings.goto('chrome-extension://'+extensionID+'/settings.html');
    // await browser.close();
    console.log("test completed")
})();