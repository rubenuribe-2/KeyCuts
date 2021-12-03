import { addKeyCut, deleteKeyCut, getBtnElem } from './utils.js';

const newCutButton = document.getElementById('add-new-button');
const KeyCutsTable = document.getElementById('keycuts-tbl').lastChild;

const workspaceOrDelete = KeyCutsTable.getElementsByClassName('add-to-workspace');

var keyCuts;
var spaces;
let del_history = [];
let elem_history = [];
function clickedRow(e){ //fired when a keycut row is clicked

    //rn we only want to open the url if table is ctrl/command clicked
    if(e.metaKey || e.ctrlKey){
        const url = e.path.find(e=>{
            console.log(e.nodeName);
            return e.nodeName == "TR";
        }).getElementsByClassName('url-field')[0].value;
        window.open(url);
    }

}

function KCfromRow(row){
  const shortcut = row.getElementsByClassName('keycut-field')[0].value;
  const none = row.getElementsByClassName('url-field')[0].value;
  const before = row.getElementsByClassName('before-field')[0].value;
  const after = row.getElementsByClassName('after-field')[0].value;

  return {shortcut: shortcut, none: none, before: before, after: after};
}

function checkSame(row,keyCut){ //checks a given row (HTML table row object) is in sync with the keyCut object
    const newKC = KCfromRow(row);
    console.log(newKC);
    if(newKC.shortcut === keyCut.shortcut && newKC.none === keyCut.none && newKC.before == keyCut.before && newKC.after == keyCut.after){
        console.log('istrue')
        row.classList.remove('not-saved'); 
    } else {
      row.classList.add('not-saved');
    }
}

function getRowFromField(field){
  const row = field.classList.contains('keycut-field')? 
              field.parentNode.parentNode:
              field.parentNode.parentNode.parentNode.parentNode;
  return row;
}

function onKeyCutChange(e){
    //fires when a keycuts shortcut or url text box is changed
    e.srcElement.value = e.srcElement.value.split(' ').join('');
    const row = getRowFromField(e.srcElement);
    console.log(row);

    const id = row.id;
    const keyCut = keyCuts[id];
    checkSame(row,keyCut)
}

document.addEventListener('keydown', function(event) { // undos a deleted KeyCut
  if (event.ctrlKey || event.metaKey && event.key === 'z') {
    addKeyCut(del_history.pop());
    elem_history.pop().classList.remove("hidden");
  }
});
function clickAddorDelete(e){
  // event handler for the button on the right side of KeyCuts
  const src_elem = e.srcElement;
  const id = src_elem.id;
  const cut_name = id.slice(4);
  if(e.srcElement.classList.contains('save')){
    console.log("should save kC");
  }
  else if(e.srcElement.classList.contains('delete')){
    console.log ('should remove', cut_name);
    
    const old_elem = document.getElementById(cut_name);
    console.log(old_elem);
    elem_history.push(old_elem);
    old_elem.classList.add('hidden');
  } else {
    console.log('should add to workspace toggle');
  }
  
}

function deleteCut(e){
  const btnElem = getBtnElem(e.srcElement);
  const row = btnElem.parentNode.parentNode;
  const cut_name = row.id;
  deleteKeyCut(cut_name).then((old_cut)=>{
    del_history.push(old_cut);
  });
  row.parentNode.removeChild(row);
  console.log('delete this cut');
}

function saveCut(e){
  const btnElem = getBtnElem(e.srcElement);
  const row = btnElem.parentNode.parentNode;
  const newKC = KCfromRow(row);
  if(row.id == 'newCut'){
    //save it
    row.id = newKC.shortcut;
    addKeyCut(newKC);

  } else if (row.id == newKC.shortcut) {
    //replace it
    addKeyCut(newKC);

  } else {
    //delete old
    deleteKeyCut(row.id);
    addKeyCut(newKC);
    //save new
  }
  row.classList.remove('not-saved');
  console.log('save this cut');
}

function reloadCut(e){
  const btnElem = getBtnElem(e.srcElement);
  const row = btnElem.parentNode.parentNode;
  const shortcut_field = row.getElementsByClassName('keycut-field')[0];
  const url_field = row.getElementsByClassName('url-field')[0];
  const before_field = row.getElementsByClassName('before-field')[0];
  const after_field = row.getElementsByClassName('after-field')[0];
  if(row.id == 'newCut'){
    shortcut_field.value = '';
    url_field.value = '';
  } else {
    shortcut_field.value = row.id;
    url_field.value = keyCuts[row.id].none;
    before_field.value = keyCuts[row.id].before;
    after_field.value = keyCuts[row.id].after;
  }
  checkSame(row,keyCuts[row.id]);
  console.log('reload this cut');
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(key === "KeyCuts"){
      
      // chrome.storage.sync.set({"!!!": Object.keys(newValue)});
      keyCuts = newValue;
    } else if (key === "KeySpaces"){
      spaces = Object.keys(newValue);
    }
    
  }
});



chrome.storage.sync.get(['KeyCuts'], ({KeyCuts} = keycuts)=>{
  console.log(KeyCuts);
  keyCuts = KeyCuts
  for (const cut in KeyCuts){
    console.log(cut, KeyCuts[cut]);
    addCut(cut,KeyCuts[cut]);
  }
});

newCutButton.addEventListener("click",(e)=>{
  if(!document.getElementById('newCut')){
    newCut('newCut',{none: '', shortcut: '', before: '', after: ''} );
  }
  
})

function moreBtn(e){
  console.log('more btn clicked');
  const btnElem = getBtnElem(e.srcElement);
  const holder = btnElem.parentNode.parentNode;
  holder.classList.toggle('advanced');
}

function createUrlFields(cutProps){

  const keyCut_none = document.createElement('td');

  
  

  
  const holder = document.createElement('div');
  holder.classList.add('cut-field-holder');
  
  const topFields = document.createElement('div');
  topFields.classList.add('top-fields');
  const bottomFields = document.createElement('div');
  bottomFields.classList.add('bottom-fields');

  holder.appendChild(topFields);
  holder.appendChild(bottomFields);

  keyCut_none.appendChild(holder);


  const keyCut_none_input = document.createElement('input');
  keyCut_none_input.addEventListener('input',onKeyCutChange);
  keyCut_none_input.value = cutProps.none;
  keyCut_none_input.classList.add("text-field");
  keyCut_none_input.classList.add("url-field");
  keyCut_none_input.type = "text";
  
  topFields.appendChild(keyCut_none_input);

  const more = document.createElement('button');
  more.classList.add('more-btn');
  more.addEventListener('click',moreBtn);
  const more_img = document.createElement('img');
  more_img.classList.add('more-img'); 
  more_img.src = 'img/more.png';
  more_img.alt = 'more options';

  more.appendChild(more_img);
  topFields.appendChild(more);

  const keyCut_before_input = document.createElement('input');
  keyCut_before_input.addEventListener('input',onKeyCutChange);
  keyCut_before_input.value = cutProps.before;
  keyCut_before_input.classList.add("text-field");
  keyCut_before_input.classList.add("before-field");

  bottomFields.appendChild(keyCut_before_input);

  const query = document.createElement('p');
  query.innerHTML = '{Query}';
  bottomFields.appendChild(query);


  const keyCut_after_input = document.createElement('input');
  keyCut_after_input.addEventListener('input',onKeyCutChange);
  keyCut_after_input.value = cutProps.after;
  keyCut_after_input.classList.add("text-field");
  keyCut_after_input.classList.add("after-field");

  bottomFields.appendChild(keyCut_after_input);
  return keyCut_none;
}

function createMultiBtn(cutName="newCut"){
  const keyCut_btn_cell = document.createElement('td');

  const delete_kc_btn = document.createElement('button');
  const delete_img = document.createElement('img');
  delete_img.src = 'img/trash-can.png';
  delete_img.alt = 'delete this keyCut';
  delete_img.classList.add('secondary-img')

  delete_kc_btn.appendChild(delete_img);
  delete_kc_btn.addEventListener('click',deleteCut);
  delete_kc_btn.classList.add('add-to-workspace');
  delete_kc_btn.classList.add('save');
  delete_kc_btn.classList.add('multi-btn');
  delete_kc_btn.id = "btn-"+cutName;

  keyCut_btn_cell.appendChild(delete_kc_btn);

  const save_btn = document.createElement('button');
  save_btn.addEventListener("click",saveCut);
  const reload_btn = document.createElement('button');
  reload_btn.addEventListener("click", reloadCut);
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

function newCut(cutName, cutProps){
  const TableRow = document.createElement('tr');
  TableRow.id = cutName;
  TableRow.classList.add('not-saved');
  const keyCut_short = document.createElement('td');
  keyCut_short.classList.add('keycut-table-cell');
  keyCut_short.innerHTML='!';

  const keyCut_short_input = document.createElement('input');
  keyCut_short_input.value = '';
  keyCut_short_input.type = "text";
  keyCut_short_input.classList.add("text-field");
  keyCut_short_input.classList.add("keycut-field");
  keyCut_short_input.addEventListener("input",onKeyCutChange);
//   keyCut_short_input.addEventListener("change",(e)=>{
//     console.log(this.value);
//   })
  keyCut_short.appendChild(keyCut_short_input);
  TableRow.appendChild(keyCut_short);

  const keyCut_none = createUrlFields(cutProps);

  TableRow.appendChild(keyCut_none);

  const keyCut_btn_cell = createMultiBtn(cutName);
  TableRow.appendChild(keyCut_btn_cell);

  KeyCutsTable.insertBefore(TableRow,document.getElementById('add-new'));
}




function addCut(cutName, cutProps){
  const TableRow = document.createElement('tr');
  TableRow.addEventListener("click",clickedRow);
  TableRow.id = cutName;
  const keyCut_short = document.createElement('td');
  keyCut_short.classList.add('keycut-table-cell');
  keyCut_short.innerHTML='!';

  const keyCut_short_input = document.createElement('input');
  keyCut_short_input.value = cutName;
  keyCut_short_input.type = "text";
  keyCut_short_input.classList.add("text-field");
  keyCut_short_input.classList.add("keycut-field");
  keyCut_short.appendChild(keyCut_short_input);
  keyCut_short_input.addEventListener("input",onKeyCutChange);
  keyCut_short_input.id= "srt-"+cutName;
  TableRow.appendChild(keyCut_short);

  const keyCut_none = createUrlFields(cutProps);

  TableRow.appendChild(keyCut_none);

  const keyCut_btn_cell = createMultiBtn();

  TableRow.appendChild(keyCut_btn_cell);

  KeyCutsTable.insertBefore(TableRow,document.getElementById('add-new'));
}