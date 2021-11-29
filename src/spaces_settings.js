var keySpaces;
const KeySpaceTable = document.getElementById('keyspaces-tbl').lastChild;

function onKeySpaceChange(){
    console.log("theres been a change");
}
function clickAdd(){
    console.log('clicked add');
}

chrome.storage.sync.get(['KeySpaces'], ({KeySpaces} = keySpaces)=>{
    console.log(KeySpaces);
    keySpaces = KeySpaces;
    for (const space in KeySpaces){
        console.log(KeySpaces[space]);
        addSpace(space,KeySpaces[space]);
    }
});

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

    const keyCut_none = document.createElement('td');


    space.forEach((url, idx)=>{
        const keyCut_none_input = document.createElement('input');
        keyCut_none_input.value = url;
        keyCut_none_input.type = "text";
        keyCut_none_input.classList.add("text-field");
        keyCut_none_input.classList.add("url-field");
        keyCut_none_input.addEventListener("input",onKeySpaceChange);
        keyCut_none_input.id= `url-${idx}-${spaceName}`;
        keyCut_none.appendChild(keyCut_none_input);
    })

    TableRow.appendChild(keyCut_none);

    const keyCut_btn_cell = document.createElement('td');

    const keyCut_btn = document.createElement('button');
    keyCut_btn.innerHTML = '+';
    keyCut_btn_cell.addEventListener('click',clickAdd);
    keyCut_btn.classList.add('add-to-workspace');
    keyCut_btn.id= "btn-"+spaceName;

    keyCut_btn_cell.appendChild(keyCut_btn);

    TableRow.appendChild(keyCut_btn_cell);

    KeySpaceTable.insertBefore(TableRow,document.getElementById('add-new-space'));
}