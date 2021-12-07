// tests wether extension loads successfully
const { assert } = require('console');
const puppeteer = require('puppeteer');


const args = process.argv.slice(2);

console.log(args);

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

async function createShortcuts(page,no_shortcuts){
    const newCutBtn = await page.$('#add-new-button');
    for(let i = 0; i< no_shortcuts; i++){
        await newCutBtn.click();
        let done = await page.$('#newCut');
        while(!done){
            done = await page.$('#newCut');
        }
        await page.evaluate(()=>{

         document.getElementById('newCut').scrollIntoView();
        })
        const kcField = await page.$('#newCut .keycut-field');
        await kcField.type(`a${i}`);
        const urlField = await page.$('#newCut .url-field');
        await urlField.type(`https://www.google.com/`);
        const save = await page.$('#newCut .save-space-btn');
        await save.click();
        while(done){
            try{
                await save.click();
                done = await page.$('#newCut');
            }
            catch {
                done = await page.$('#newCut');
            }       
        }
    }
}

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
    await delay(300);
    if(args[0]==='stress'){
        await settings.goto('chrome-extension://'+extensionID+'/settings.html');
        createShortcuts(settings,51);
    }   if(args[0]==='popup') {
        //test responsiveness of make KeyCut button
        await settings.goto('chrome-extension://'+extensionID+'/popup.html');
        const button = await settings.$('#keycut-btn');
        //test what if blank:
        const shortcut = await settings.$('#KeyCut-field');
        const inputValue = await settings.$eval('#KeyCut-field', el => el.value);
        console.log(inputValue);
        for (let i = 0; i < inputValue.length; i++) {
            await shortcut.press('Backspace');
        }
        var button_content = await settings.$eval('#keycut-btn', el => el.innerHTML);
        console.assert(button_content === ':(', 'BLANK KC FIELD IN POPUP IS BEING ACCEPTED');
        
        
        // test what if override
        await shortcut.type('a');
        button_content = await settings.$eval('#keycut-btn', el => el.innerHTML);
        console.assert(button_content === "Replace 'a' KeyCut", 'a is not saying replaced IS BEING ACCEPTED');




        
        const url = await settings.$('#url-field');
        // await shortcut.type('a');
        // console.log(shortcut);
    }


    // await browser.close();
    console.log("test completed")
})();