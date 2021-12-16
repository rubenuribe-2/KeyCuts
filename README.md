# KeyCuts



# Instructions to add extension to Chrome:

1. Open the Extension Management page by navigating to chrome://extensions.
    - Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu.
    - Alternatively, open this page by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory.

# Instructions for running tests

Our tests can be found in the file tests/startup.js
They run on pupeteer.
to install pupeteer run
```
npm i
```
to run the stress tests run the command
```
node tests/startup.js stress
```
to run the popup tests run the command
```
node tests/startup.js popup
```
# Files

##  Manifest.json
refer to chromes https://developer.chrome.com/docs/extensions/mv3/intro/ documentation on manifest v3

## utils.js
Has a bunch of utility functions that can be imported into other files

## popup

### Popup.html
The structure of the the popup
### popup.js
Controlls the setup of the inittial popup opening
### small-manager.js
Controlls seeing if the site is already a KC and setting up the popup to save a new keyCut or edit a new one


## settings
### options.html
the settings page
### cuts_settings.js
This code controls the keycuts tab, and takes care of syncing with the database and editing keycuts
### spaces_settings.js
This code controls the spaces tab, and takes care of syncing with the Database and editing keycuts

