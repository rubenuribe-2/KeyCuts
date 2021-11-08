
const tabs = document.getElementsByClassName("tablinks");
const editButten = document.getElementById('toggle-edit');
const workspaceOrDelete = document.getElementsByClassName('add-to-workspace');
let editOn = false;
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
})
for (i=0;i<tabs.length;i++){
    tabs[i].addEventListener('click',(evt)=>{
        console.log(evt);
        openTab(evt,evt.currentTarget.name);
    })
}

tabs[0].click();

function openTab(evt, cityName) {
    console.log("hi");
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "flex";
    evt.currentTarget.className += " active";
  }


const KeyCutsTable = document.getElementById('keycuts-tbl').lastChild;


chrome.storage.sync.get(['KeyCuts'], ({KeyCuts} = spaces)=>{
  console.log(KeyCuts);
  for (const cut in KeyCuts){
    console.log(cut, KeyCuts[cut]);
    addCut(cut,KeyCuts[cut]);
  }
});

function addCut(cutName, cutProps){
  const TableRow = document.createElement('tr');
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
  TableRow.appendChild(keyCut_short);

  const keyCut_none = document.createElement('td');

  const keyCut_none_input = document.createElement('input');
  keyCut_none_input.value = cutProps.none;
  keyCut_none_input.type = "text";
  keyCut_none_input.classList.add("text-field");
  keyCut_none.appendChild(keyCut_none_input);

  TableRow.appendChild(keyCut_none);

  const keyCut_btn_cell = document.createElement('td');

  const keyCut_btn = document.createElement('button');
  keyCut_btn.innerHTML = '+';
  keyCut_btn.classList.add('add-to-workspace');

  keyCut_btn_cell.appendChild(keyCut_btn);

  TableRow.appendChild(keyCut_btn_cell);

  KeyCutsTable.insertBefore(TableRow,document.getElementById('add-new'));
}