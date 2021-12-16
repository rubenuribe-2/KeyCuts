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

# Contribution
Please see contributing.md for guidance with contributing.


# Files

##  Manifest.json
refer to chromes https://developer.chrome.com/docs/extensions/mv3/intro/ documentation on manifest v3

## utils.js
Has a bunch of utility functions that can be imported into other files

### addKeySpace(keyspace, list)
    keyspace = string,
    list = [URLs]
    adds a keyspace to the database

### deleteKeySpace(shortcut)
    shortcut = keyspaceShortcut
    Removes the given keyspace from the database

### addKeyCut(keyCut)
    keycut = keycutObject
    adds the keycut to the database
    if a keycut with that shortcut allready exists it replaces it
### deleteKeyCut(shortcut)
    shortcut = string
    removes the given keycut from the database.

### getBeforeURL(url)
    This is where the searchAI lives.
    This function parses the history to find a good "before" url to search the site referanced by the given provided url.

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


## Background
This service worker runs all the time when the extension is installed

refetch_keys(), and refetch_spaces() reload the local variables that hold the varios spaces and KeyCuts.

### searchOmnibox(text)
This function runs everytime the omnibox is sed with the "!" keyword. text is the query that comes after the "!".
This will get the first argument and find the KeySpace or KeyCut associated with it and open the desired webPages

### openSpace(space)
Creates a tab group, and opens the pages in the given space in that tab group

### NavigateTo(url)
Navigates the current tab to the url provided.

### KCtoURL(KeyCut, query)
The keycut is a keycutObject and the query will be inserted inbetween the before and after of the KeyCut.

### getCurrentTab()
returns the tab that is currently open in the browser window https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab
