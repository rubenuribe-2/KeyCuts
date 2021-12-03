import { addKeySpace, deleteKeySpace, getBtnElem } from "./utils.js";

var keySpaces;
var cuts;
var editSpaces = false;
const KeySpaceTable = document.getElementById('keyspaces-tbl').lastChild;
const addOrDelete = KeySpaceTable.getElementsByClassName('add-to-workspace');
const newSpaceButton = document.getElementById('add-new-space-button');
newSpaceButton.addEventListener("click",(e)=>{
    console.log('clicked the pluss btn on btm of space screen');
    if(!document.getElementById('newSpace')){
        newSpace();
    }
})



function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

function getList(row){// returns a list of urls from a space
    const urls = []
    const inputs = row.getElementsByClassName('keyspace-url');
    for (const input of inputs){
        if(input.value.includes('://')){
            urls.push(input.value);
        }else {
            urls.push('https://' + input.value);
        }
    }
    return urls;
}
function deleteLink(e){
    const srcElem = e.srcElement.classList.contains('delete-link-btn') ? 
                    e.srcElement :
                    e.srcElement.parentNode;
    console.log(srcElem);
    const linkHolder = srcElem.parentNode;
    const row = linkHolder.parentNode.parentNode
    linkHolder.parentNode.removeChild(linkHolder);
    //TODO //Delete link from the db or set to not saved
    checkRow(row);
    console.log('deleteing-Link');
}

function checkRow(row){
    const id = row.id;
    const keySpace = keySpaces[id];
    console.log('new KeySpace');
    console.log(keySpace);
    if(checkSameSpace(row,keySpace)){
        rowIsSynced(row);
    } else {
        rowIsNotSynced(row);
    }
}

function getShortcut(row){
    return row.getElementsByClassName('keycut-field')[0].value;
}

function saveRow(row){
    const list = getList(row);
    const shortcut = getShortcut(row);
    const old_shortcut = row.id;
    if(old_shortcut == 'newSpace'){
        //just save
        addKeySpace(shortcut,list);
        //update id;
        row.id = shortcut;
    } if(shortcut == old_shortcut){
        //just overwrite
        addKeySpace(shortcut,list);
    } else {
        deleteKeySpace(old_shortcut)
        addKeySpace(shortcut,list);
        //delete old and make new
    }
    rowIsSynced(row);
}

function checkSameSpace(row,space){//checks if row is in sync with db
    const list = getList(row);
    const cut_val = row.getElementsByClassName('keycut-field')[0].value;
    const cut_db = row.id;
    console.log(space);
    console.log(list);
    return cut_val == cut_db && arraysEqual(list,space);
}
function checkValid(row){
    //check the validity of a row
    return true;
}
function rowIsSynced(row){
    row.classList.remove('not-saved');
}
function rowIsNotSynced(row){
    row.classList.add('not-saved');
}


function onKeySpaceChange(e){
    console.log("theres been a change");
    const src_elem = e.srcElement;
    src_elem.value = src_elem.value.split(' ').join('');
    const row = src_elem.classList.contains('keycut-field') ? 
                src_elem.parentNode.parentNode :
                src_elem.parentNode.parentNode.parentNode;
    console.log(row);
    checkRow(row);
}



function deleteSpace(e){
    //delete space;
    const btnElem = getBtnElem(e.srcElement);
    const row = btnElem.parentNode.parentNode;
    console.log(row);
    deleteKeySpace(row.id);
    row.parentNode.removeChild(row);
}
function saveSpace(e){
    //save space if valid
    const btnElem = getBtnElem(e.srcElement);
    const row = btnElem.parentNode.parentNode;
    saveRow(row);
}
function reloadSpace(e){
    //replace space content with db content
    const btnElem = getBtnElem(e.srcElement);
    const row = btnElem.parentNode.parentNode;
    const shortcut = row.id;
    const links = keySpaces[shortcut];
    const newLinks = createLinks(shortcut,links);
    const oldHTML = row.getElementsByClassName('space-links-cell')[0];
    row.insertBefore(newLinks, oldHTML);
    oldHTML.parentNode.removeChild(oldHTML);
    checkRow(row);
}


function newLink(e){
    console.log(e);
    const id = e.srcElement.id.slice(4);
    const row = document.getElementById(id);
    console.log(row);
    console.log(id);
    const urls_cell = row.getElementsByTagName('td')[1];
    console.log(urls_cell);
    const new_input = createLink();
    // new_input.id= `url-${idx}-${spaceName}`;  
    urls_cell.insertBefore(new_input, e.srcElement);  
    console.log()
    console.log('new link in space');
    checkRow(row);
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if(key === "KeySpaces"){
        keySpaces = newValue;
      } else if (key === "KeyCuts"){
        cuts = Object.keys(newValue)
      }
      
    }
  });
chrome.storage.sync.get(['KeySpaces'], ({KeySpaces} = keySpaces)=>{
    console.log(KeySpaces);
    keySpaces = KeySpaces;
    for (const space in KeySpaces){
        console.log(KeySpaces[space]);
        addSpace(space,KeySpaces[space]);
    }
});

function createLink(value, del = true){
    const holder = document.createElement('div');
    holder.classList.add('space-link-holder')
    const new_input = document.createElement('input');
    new_input.value = value||'';
    new_input.type = "text";
    new_input.classList.add("text-field");
    new_input.classList.add("url-field");
    new_input.classList.add("keyspace-url");
    new_input.addEventListener("input",onKeySpaceChange);
    holder.appendChild(new_input);
    if (del){
        const trash = document.createElement('button');
        trash.classList.add('delete-link-btn');
        trash.addEventListener('click',deleteLink);
        const trash_img = document.createElement('img');
        trash_img.classList.add('trash-img')
        trash_img.src = 'img/trash-can.png';
        trash_img.alt = 'delete link from space';
        trash.appendChild(trash_img);
        holder.appendChild(trash);
    }

    return holder;
}

function createMultiBtn(spaceName="newSpace"){
    const keyCut_btn_cell = document.createElement('td');

    const keyCut_btn = document.createElement('button');
    const delete_img = document.createElement('img');
    delete_img.src = 'img/trash-can.png';
    delete_img.alt = 'delete this space';
    delete_img.classList.add('secondary-img')

    keyCut_btn.appendChild(delete_img);
    keyCut_btn.addEventListener('click',deleteSpace);
    keyCut_btn.classList.add('add-to-workspace');
    keyCut_btn_cell.classList.add('save');
    keyCut_btn_cell.classList.add('multi-btn');

    keyCut_btn.id= "btn-"+spaceName;

    keyCut_btn_cell.appendChild(keyCut_btn);

    const save_btn = document.createElement('button');
    save_btn.addEventListener("click",saveSpace);
    const reload_btn = document.createElement('button');
    reload_btn.addEventListener("click", reloadSpace);
    const save_img = document.createElement('img');
    save_img.src = 'img/save.png';
    save_img.alt = 'save changes to this space';
    const reload_img = document.createElement('img');
    reload_img.src = 'img/reload.png';
    reload_img.alt = 'discard changes to this space';
    save_img.classList.add('secondary-img');
    reload_img.classList.add('secondary-img');
    reload_img.classList.add('reload-img');
    save_btn.appendChild(save_img);
    reload_btn.appendChild(reload_img);

    save_btn.classList.add('save-space-btn');
    reload_btn.classList.add('reload-space-btn');
    save_btn.classList.add('secondary');
    reload_btn.classList.add('secondary');

    keyCut_btn_cell.appendChild(reload_btn);
    keyCut_btn_cell.appendChild(save_btn);
    return keyCut_btn_cell;
}

function createLinks(spaceName = "newSpace", space = []){
    const keyCut_none = document.createElement('td');
    keyCut_none.classList.add('space-links-cell');
    if(space.length > 0){
        space.forEach((url, idx)=>{
            const keyCut_none_input = createLink(url);
            keyCut_none_input.id= `url-${idx}-${spaceName}`;
            keyCut_none.appendChild(keyCut_none_input);
        })
    } else {
        const keyCut_none_input = createLink();
        keyCut_none.appendChild(keyCut_none_input);
    }
    const newLinkInSpace = document.createElement('button');
    newLinkInSpace.classList.add('add_new_link');
    newLinkInSpace.id = `btn-${spaceName}`;
    newLinkInSpace.innerText = '+';
    newLinkInSpace.addEventListener("click",newLink);
    keyCut_none.appendChild(newLinkInSpace);
    return keyCut_none;
}

function addSpace(spaceName, space){
    const TableRow = document.createElement('tr');
    TableRow.id = spaceName;
    const keyCut_short = document.createElement('td');
    keyCut_short.classList.add('keyspace-table-cell');
    keyCut_short.innerHTML='!';

    const keyCut_short_input = document.createElement('input');
    keyCut_short_input.value = spaceName;
    keyCut_short_input.type = "text";
    keyCut_short_input.classList.add("text-field");
    keyCut_short_input.classList.add("keycut-field");
    keyCut_short_input.addEventListener("input",onKeySpaceChange);
    keyCut_short.appendChild(keyCut_short_input);
    TableRow.appendChild(keyCut_short);

    const keyCut_none = createLinks(spaceName, space);

    TableRow.appendChild(keyCut_none);

    const keyCut_btn_cell = createMultiBtn(spaceName);

    TableRow.appendChild(keyCut_btn_cell);

    KeySpaceTable.insertBefore(TableRow,document.getElementById('add-new-space'));
}

function newSpace(){
    const TableRow = document.createElement('tr');
    TableRow.classList.add('not-saved');
    TableRow.id = "newSpace";
    const keyCut_short = document.createElement('td');
    keyCut_short.classList.add('keyspace-table-cell');
    keyCut_short.innerHTML='!';

    const keyCut_short_input = document.createElement('input');
    // keyCut_short_input.value = spaceName;
    keyCut_short_input.type = "text";
    keyCut_short_input.classList.add("text-field");
    keyCut_short_input.classList.add("keycut-field");
    keyCut_short_input.addEventListener("input",onKeySpaceChange);
    keyCut_short.appendChild(keyCut_short_input);

    TableRow.appendChild(keyCut_short);

    const keyCut_none = createLinks();

    TableRow.appendChild(keyCut_none);

    const keyCut_btn_cell = createMultiBtn();

    TableRow.appendChild(keyCut_btn_cell);

    KeySpaceTable.insertBefore(TableRow,document.getElementById('add-new-space'));
    


}