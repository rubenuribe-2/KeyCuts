const webdriver = require('selenium-webdriver');
var chromeOptions = webdriver.Capabilities.chrome();

const pathToExtension = require('path').resolve(__dirname, '../src');

chromeOptions:[
    extensions: [pathToExtension]
]

(async function example() {
    let options = 
    options.addExtension(pathToExtension);
    let driver = await new webdriver.chrome(chromeOptions);
    try {
        // Navigate to Url
        // await driver.addExtension
        await driver.get('https://www.google.com');

        // Enter text "cheese" and perform keyboard action "Enter"
        // await driver.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);

        // let firstResult = await driver.wait(until.elementLocated(By.css('h3')), 10000);

        console.log(await firstResult.getAttribute('textContent'));
    }
    finally{
        await driver.quit();
    }
})();