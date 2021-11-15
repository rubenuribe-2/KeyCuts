// test that extension speed of searching vs manual 
// import timer from './timer.js';
// import puppeteer from 'puppeteer';
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
    // await dummyPage.waitForTimeout(2000); // arbitrary wait time.
    // dummyPage.goto('! yt howdy');
    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
        return  _targetInfo.type === 'service_worker';
    });
    console.assert(extensionTarget,"extension failed to innitialize");
    console.log({extensionTarget});
    //gets the extension ID of the target
    const [,,extensionID,] = extensionTarget._targetInfo.url.split('/');
    console.log({extensionID});

    const backgroundPage = await extensionTarget.worker();
    const t0 = performance.now()
    // backgroundPage.evaluate("searchOmnibox",'! yt howdy');
    const t1 = performance.now()
    dummyPage.waitForTimeout(3000);
    console.log(t1-t0);
    // console.log(backgroundPage);
    // await browser.close();
  })();