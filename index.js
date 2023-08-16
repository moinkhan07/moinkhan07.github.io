
let sidemenu = document.getElementById("sidemenu");

function openmenu(){
    sidemenu.style.right = "0";
}
function closemenu(){
    sidemenu.style.right = "-220px";
}

let openResume = document.getElementById("openResume");
openResume.onclick=()=>{
    window.open("./resource/Moin_Khan_Resume.pdf", '_blank');
}