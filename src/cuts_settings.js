import { addKeyCut, deleteKeyCut } from './utils.js';

const editButten = document.getElementById('toggle-edit');
const newCutButton = document.getElementById('add-new-button');
const workspaceOrDelete = document.getElementsByClassName('add-to-workspace');

let editOn = false;
var keyCuts;
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
function checkSame(row,keyCut){ //checks a given row (HTML table row object) is in sync with the keyCut object
    console.log(row.getElementsByClassName('keycut-field')[0].value)
    console.log(row.getElementsByClassName('url-field')[0].value)
    console.log(keyCut)
    if(row.getElementsByClassName('keycut-field')[0].value === keyCut.shortcut && row.getElementsByClassName('url-field')[0].value === keyCut.none){
        console.log('istrue')
        return true;
    } else {
        return false;
    }
}

function onKeyCutChange(e){
    //fires when a keycuts shortcut or url text box is changed
    const src_elem = e.srcElement;
    src_elem.value = src_elem.value.split(' ').join('');
    const row = src_elem.parentNode.parentNode;
    console.log(row);

    const id = row.id;
    const keyCut = keyCuts[id];
    if(!checkSame(row,keyCut)){
        row.getElementsByClassName('multi-btn')[0].classList.add('save');
        row.classList.add('not-saved'); //display that the keyCut is currently not saved
    } else {
        row.getElementsByClassName('multi-btn')[0].classList.remove('save');
        row.classList.remove('not-saved'); //show that the current keyCut is saved
    }
    const cut_name = id.slice(4);
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
    deleteKeyCut(cut_name).then((old_cut)=>{
      del_history.push(old_cut);
    });
    const old_elem = document.getElementById(cut_name);
    console.log(old_elem);
    elem_history.push(old_elem);
    old_elem.classList.add('hidden');
  } else {
    console.log('should add to workspace toggle');
  }
  
}
editButten.addEventListener('click',(e)=>{
  if(editOn){
    for(let i = 0; i < workspaceOrDelete.length; i++){
      workspaceOrDelete[i].innerHTML = '+';
      workspaceOrDelete[i].classList.toggle('delete');
    }
    editOn=false;
  } else {
    for(let i = 0; i < workspaceOrDelete.length; i++){
      workspaceOrDelete[i].innerHTML = '-';
      workspaceOrDelete[i].classList.toggle('delete');
    }
    editOn=true;
  }
});


const KeyCutsTable = document.getElementById('keycuts-tbl').lastChild;


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
    newCut('newCut',{none: ''} );
  }
  
})

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

  const keyCut_none = document.createElement('td');

  const keyCut_none_input = document.createElement('input');
  keyCut_none_input.value = cutProps.none;
  keyCut_none_input.classList.add("text-field");
  keyCut_none_input.classList.add("url-field");
  keyCut_none_input.type = "text";
  
  console.log("why are you sleeping!!!");

  keyCut_none.appendChild(keyCut_none_input);

  TableRow.appendChild(keyCut_none);

  const keyCut_btn_cell = document.createElement('td');

  const keyCut_btn = document.createElement('button');
  keyCut_btn.innerHTML = '+';
  keyCut_btn_cell.addEventListener('click',clickAddorDelete);
  keyCut_btn_cell.classList.add('multi-btn');
  keyCut_btn.classList.add('add-to-workspace');

  keyCut_btn_cell.appendChild(keyCut_btn);

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

  const keyCut_none = document.createElement('td');

  const keyCut_none_input = document.createElement('input');
  keyCut_none_input.value = cutProps.none;
  keyCut_none_input.type = "text";
  keyCut_none_input.classList.add("text-field");
  keyCut_none_input.classList.add("url-field");
  keyCut_none_input.addEventListener("input",onKeyCutChange);
  keyCut_none_input.id= "url-"+cutName;
  keyCut_none.appendChild(keyCut_none_input);

  TableRow.appendChild(keyCut_none);

  const keyCut_btn_cell = document.createElement('td');

  const keyCut_btn = document.createElement('button');
  keyCut_btn.innerHTML = '+';
  keyCut_btn_cell.addEventListener('click',clickAddorDelete);
  keyCut_btn_cell.classList.add('multi-btn');
  keyCut_btn_cell.classList.add('save');
  keyCut_btn.classList.add('add-to-workspace');
  keyCut_btn.id= "btn-"+cutName;

  keyCut_btn_cell.appendChild(keyCut_btn);

  TableRow.appendChild(keyCut_btn_cell);

  KeyCutsTable.insertBefore(TableRow,document.getElementById('add-new'));
}