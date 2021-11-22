
const tabs = document.getElementsByClassName("tablinks");


for (let i=0;i<tabs.length;i++){
    tabs[i].addEventListener('click',(evt)=>{
        console.log(evt);
        openTab(evt,evt.currentTarget.name);
    })
}

tabs[0].click();

function openTab(evt, tabName) {
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
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
  }

