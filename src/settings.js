
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